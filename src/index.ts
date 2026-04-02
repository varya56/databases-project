import {usersTable} from './postgres/schema';
import {db} from "./postgres/db"
import {eq} from "drizzle-orm"
import {connectToMongo, disconnectMongo} from "./mongo/db.ts";
import {Transaction} from "./mongo/models/transaction";
import {createHash} from "crypto"
import {input, select, password, number} from "@inquirer/prompts";

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

async function createTransaction(sender_id: number, recipient_ids: [number], content: string, visibility: "public" | "friends-only" | "private") {
    try {
        await Transaction.create({
            sender: sender_id,
            recipients: recipient_ids,
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
        message: "What is your SSN?"
    })

    await createUser(first_name, last_name, email, ssn)
}

async function terminal_list_public_transactions() {
    const results = await Transaction.find({visibility: "public"})
    for (const t of results) {
        console.log(`Transaction ID: ${t._id}.\nSender ID: ${t.sender}\nContent: ${t.content}.\nVisibility: ${t.visibility}.\n`);
    }

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
                    name: "List Public Transactions",
                    value: "list_public_transactions"
                },
            ]
        })
        switch (answer) {
            case "register": {
                await terminalRegisterUser();
                break;
            }
            case "list_public_transactions": {
                await terminal_list_public_transactions();
                break;
            }

        }
    }

    await disconnectMongo();
}

await main();
