import mongoose from "mongoose"
import 'dotenv/config';
import {Transaction} from "./models/transaction";
import type {User} from "../postgres/db.ts";
import {select} from "@inquirer/prompts";


export async function connectToMongo() {
    mongoose.set('bufferCommands', false);
    return await mongoose.connect(process.env.MONGO_URL!);
}


export async function disconnectMongo() {
    await mongoose.connection.close(true);
}

export async function createTransaction(sender_id: number, recipient_ids: number[], amount: number, content: string, visibility: "public" | "friends-only" | "private") {
    try {
        await Transaction.create({
            sender: sender_id,
            recipients: recipient_ids,
            amount: amount,
            content: content,
            visibility: visibility
        });
    } catch (err) {
        console.log("Could not create transaction: " + err);
    }
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
    let transaction = await Transaction.findById(selectedTransactionID).exec();
    if (transaction == undefined) {
        console.log("Transaction was not found.")
        return;
    }
    transaction.reactions.push({
        user: currentUser.id,
        content: await select({
            message: "Select reaction:", choices: [
                {
                    name: "❤️", value: "❤️",
                },
                {
                    name: "️😁", value: "️😁",
                }
            ]
        })
    });
    await transaction.save();
}

