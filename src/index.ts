import {usersTable} from './postgres/schema';
import {db} from "./postgres/db"
import {eq} from "drizzle-orm"
import {connectToMongo, disconnectMongo} from "./mongo/db.ts";
import {Transaction} from "./mongo/models/transaction";
import {createHash} from "crypto"
import {input, select, password, number} from "@inquirer/prompts";
import {exists} from "drizzle-orm/sql/expressions/conditions";

type User = typeof usersTable.$inferSelect;

async function createUser(first_name: string, last_name: string, email: string, ssn: string) {
    const result = await db.insert(usersTable)
        .values({
            first_name,
            last_name,
            email,
            ssn_hash: createHash("sha256").update(ssn).digest("hex")
        })
        .onConflictDoNothing()
        .returning();
    return result[0];
}

async function createTransaction(sender_id: number, recipient_ids: [number], amount: number, content: string, visibility: "public" | "friends-only" | "private") {
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


async function findUserByEmail(email: string): Promise<User | undefined> {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user[0];
}

async function terminalRegisterUser() {
    const first_name = await input({
        message: "What is your first name?"
    });
    const last_name = await input({
        message: "What is your last name?"
    });
    const email = await input({
        message: "What is your email?"
    });
    const ssn = await password({
        message: "What is your SSN?",
        mask: true
    })

    await createUser(first_name, last_name, email, ssn)
}

async function terminalListPublicTransactions() {
    const results = await Transaction.find({visibility: "public"})
    if (results.length == 0) {
        console.log("No transactions found.")
        return;
    }
    for (const t of results) {
        console.log(`Transaction ID: ${t._id}.\nSender ID: ${t.sender}\nContent: ${t.content}.\nVisibility: ${t.visibility}.\n`);
    }
}

async function terminalCreateTransaction() {
    let senderID: number;
    const senderEmail = await input({
        message: "Sender's email: ", required: true, validate: (async (str: string) => {
            let user = await db.select({id: usersTable.id}).from(usersTable).where(eq(usersTable.email, str));
            if (user.length == 0) {
                return "No user with this email found."
            }
            senderID = user[0].id
            return true
        })
    });

    const recipientEmails = await input({required: true, message: "Recipient email addresses (comma separated): "});
    const amount = await number({
        message: "Transaction Amount: ", min: 0.01, step: 0.01, required: true
    });
    const content = await input({message: "Transaction message: ", required: true})
    const visibility = await select({
        message: "Transaction visibility", choices: [
            {
                name: "Public",
                value: "public"
            },
            {
                name: "Friends Only",
                value: "friends-only"
            },
            {
                name: "Private",
                value: "private"
            }
        ]
    })

    let emails: String[] = recipientEmails.split(",")

    // todo
    await createTransaction(senderID, [1], amount, content, visibility);


}

async function main() {
    await connectToMongo();

    let running = true;
    while (running) {
        const answer = await select({
            message: "Please select an option.",
            choices: [
                {
                    name: "Register Account",
                    value: "register"
                },
                {
                    name: "Create Transaction",
                    value: "createTransaction"
                },
                {
                    name: "List Public Transactions",
                    value: "listPublicTransactions"
                }
            ]
        })
        switch (answer) {
            case "register": {
                await terminalRegisterUser();
                break;
            }
            case "createTransaction": {
                await terminalCreateTransaction();
                break;
            }
            case "listPublicTransactions": {
                await terminalListPublicTransactions();
                break;
            }


        }
    }

    await disconnectMongo();
}

await main();
