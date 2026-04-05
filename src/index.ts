import {usersTable} from './postgres/schema';
import {createUser, db, getUserFromID, type User} from "./postgres/db"
import {eq, ne} from "drizzle-orm"
import {connectToMongo, createTransaction, disconnectMongo, unknownUser} from "./mongo/db.ts";
import {Transaction} from "./mongo/models/transaction";
import {createHash} from "crypto"
import {input, select, password, number, Separator, checkbox} from "@inquirer/prompts";
import { connectToNeo4j, disconnectNeo4j } from './neo4j/db';
import { getAllUsers} from './neo4j/models/userRelations';


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
    });
    const pw = await password({
        message: "Choose a password:",
        mask: true
    });

    await createUser(first_name, last_name, email, ssn, pw)
}

async function terminalListPublicTransactions() {
    const results = await Transaction.find({visibility: "public"})
    let choices: any[] = [];
    if (results.length == 0) {
        console.log("No transactions found.")
        return;
    }
    for (const t of results) {
        let senderUser = await getUserFromID(t.sender)
        if (senderUser == undefined) {
            senderUser = unknownUser
        }
        let recipients = "";
        for (const [i, r] of t.recipients.entries()) {
            let user = await getUserFromID(r);
            if (i == 0) {
                recipients = (user == undefined ? `Unknown user` : `${user.first_name} ${user.last_name}`);

            } else {
                recipients += (user == undefined ? `, Unknown user` : `, ${user.first_name} ${user.last_name}`);
            }
        }

        choices.push({
            value: t._id,
            name: `${senderUser.first_name} ${senderUser.last_name} -> ${recipients}: \$${t.amount}`,
            description: t.content,
        });
    }
    choices.push(new Separator("-- end of list --"))
    choices.push({value: "quit", name: "Go back", description: "Go back to the main menu."})
    await select({message: "Select transaction:", choices: choices})
}

async function terminalCreateTransaction() {

    // const recipientEmails = await input({required: true, message: "Recipient email addresses (comma separated): "});
    let allUsers = await db.select({
        value: usersTable.id,
        name: usersTable.first_name
    }).from(usersTable).where(ne(usersTable.id, currentUser.id))
    const recipientIDs = await checkbox({required: true, message: "Select recipients.", choices: allUsers})
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

    await createTransaction(currentUser.id, recipientIDs, amount, content, visibility as "public" | "friends-only" | "private");


}


async function terminalLogin() {
    const email = await input({message: "Email: ", required: true});
    const pw = await password({message: "Password: ", mask: true});

    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (user.length === 0 || user[0]?.password_hash !== createHash("sha256").update(pw).digest("hex")) {
        console.log("Invalid email or password.");
        return;
    }
    console.clear();
    console.log(`Welcome back, ${user[0].first_name}!`);
    currentUser = user[0];
}

let currentUser: User | undefined = undefined;

async function main() {
    await connectToMongo();
    await connectToNeo4j();

    let running = true;
    while (running) {
        const answer = await select({
            message: "Please select an option.",
            choices: currentUser ? [
                {
                    name: "Create Transaction",
                    value: "createTransaction"
                },
                {
                    name: "List Public Transactions",
                    value: "listPublicTransactions"
                },
                {
                    name: "List Graph Users",
                    value: "listGraphUsers",
                    disabled: "To do"
                },
                {
                    name: "Get Friend Recommendations",
                    value: "friendRecommendations",
                    disabled: "To do"
                },
                {
                    name: "Exit",
                    value: "exit"
                }
            ] : [
                {
                    name: "Register Account",
                    value: "register"
                },
                {
                    name: "Login",
                    value: "login"
                },
                {
                    name: "Exit",
                    value: "exit"
                }
            ]
        })
        switch (answer) {
            case "register": {
                await terminalRegisterUser();
                break;
            }
            case "login": {
                await terminalLogin();
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
            case "listGraphUsers": {
                const users = await getAllUsers();
                for (const u of users) {
                    console.log(`User ID: ${u.userId} | Username: ${u.username} | Email: ${u.email}`);
                }
                break;
            }
            case "exit": {
                running = false;
                break;
            }
        }
    }

    await disconnectMongo();
    await disconnectNeo4j();
}

await main();
