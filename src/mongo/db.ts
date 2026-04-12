import mongoose from "mongoose"
import 'dotenv/config';
import {Transaction} from "./models/transaction";
import {db, getUserFromID, type User} from "../postgres/db.ts";
import {select} from "@inquirer/prompts";
import {usersTable} from "../postgres/schema.ts";
import {eq, sql} from "drizzle-orm";


export async function connectToMongo() {
    mongoose.set('bufferCommands', false);
    return await mongoose.connect(process.env.MONGO_URL!);
}


export async function disconnectMongo() {
    await mongoose.connection.close(true);
}

export async function createTransaction(sender_id: number, recipient_ids: number[], amount: number, content: string, visibility: "public" | "friends-only" | "private") {
    let sender;
    try {
        let senders = await db.select({
            id: usersTable.id,
            balance: usersTable.balance
        }).from(usersTable).where(eq(usersTable.id, sender_id));

        if (senders == undefined) {
            console.log("Unable to fetch users.")
            return
        }
        sender = senders[0];
    } catch {
        console.log("Unable to fetch users.")
        return;
    }

    // @ts-ignore
    if (Number(sender.balance) < amount) {
        console.log("User's balance is less than the transaction amount.")
        return;
    }

    await db.transaction(async (tx) => {
        try {
            await Transaction.create({
                sender: sender_id,
                recipients: recipient_ids,
                amount: amount,
                content: content,
                visibility: visibility
            });
            await tx.update(usersTable).set({
                balance: sql`${usersTable.balance}
                -
                ${amount}`
            }).where(eq(usersTable.id, sender_id));
            for (const recipient of recipient_ids) {
                await tx.update(usersTable).set({
                    balance: sql`${usersTable.balance}
                    +
                    ${amount}`
                }).where(eq(usersTable.id, recipient));
            }
        } catch {
            tx.rollback();
            console.log("Could not create transaction!")
        }
    });
}

export const unknownUser: User = {
    id: 1,
    first_name: "Unknown",
    last_name: "User",
    email: "unknown@example.com",
    balance: "0.00",
    ssn_hash: "0",
    status: "active",
    password_hash: "-"

}

export async function addCommentToTransaction(selectedTransactionID: string, currentUser: User, content: string) {
    let transaction = await Transaction.findById(selectedTransactionID).exec();
    if (transaction == undefined) {
        console.log("Transaction was not found.")
        return;
    }
    transaction.comments.push({
        user: currentUser.id,
        content: content
    });
    await transaction.save();
}

export async function addReactionToTransaction(selectedTransactionID: string, currentUser: User) {
    const reactions = ["❤️", "👍", "👎", "😎"]
    let transaction = await Transaction.findById(selectedTransactionID).exec();
    if (transaction == undefined) {
        console.log("Transaction was not found.")
        return;
    }
    transaction.reactions.push({
        user: currentUser.id,
        content: await select({
            message: "Select reaction:", choices:
                reactions.map(n => {
                    return {name: n, value: n}
                })

        })
    });
    await transaction.save();
}


export async function printTransactionComments(transactionID: string) {
    let transaction = await Transaction.findById(transactionID).exec();
    if (transaction == undefined) {
        console.log("Transaction was not found.")
        return;
    }
    for (const c of transaction.comments) {
        // @ts-ignore
        let user = await getUserFromID(c.user)
        console.log(`${user.first_name} ${user.last_name}: ${c.content}`)
    }

}
export async function printTransactionReactions(transactionID: string) {
    let transaction = await Transaction.findById(transactionID).exec();
    if (transaction == undefined) {
        console.log("Transaction was not found.")
        return;
    }
    for (const r of transaction.reactions) {
        // @ts-ignore
        let user = await getUserFromID(r.user)
        console.log(`${user.first_name} ${user.last_name}: ${r.reaction}`)
    }

}