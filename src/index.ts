import {usersTable} from './postgres/schema';
import {createUser, db, type User} from "./postgres/db"
import {eq, ne, sql} from "drizzle-orm"
import {
    addCommentToTransaction,
    addReactionToTransaction,
    connectToMongo,
    createTransaction,
    disconnectMongo,
    printAndGetPublicTransactions,
    printTransactionComments,
    printTransactionReactions
} from "./mongo/db.ts";
import {createHash} from "crypto"
import {checkbox, input, number, password, select, Separator} from "@inquirer/prompts";
import {connectToNeo4j, disconnectNeo4j} from './neo4j/db';
import {
    areFriends,
    createFriendship,
    createTransactionRelationship,
    createUser as createNeo4jUser,
    getAllUsers,
    getFriendRecommendations
} from './neo4j/models/userRelations';


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

    const newUser = await createUser(first_name, last_name, email, ssn, pw);

    if (newUser) {
        await createNeo4jUser(
            newUser.id,
            `${newUser.first_name} ${newUser.last_name}`,
            newUser.email
        );
    } else {
        console.log("Could not create user!")
    }
}

async function terminalListPublicTransactions() {
    while (true) {
        const choices = await printAndGetPublicTransactions();
        if (choices.length == 0) return;

        choices.push(new Separator("-- end of list --"))
        choices.push({value: "quit", name: "Go back", description: "Go back to the main menu."})

        const selectedTransactionID: string = await select({message: "Select transaction:", choices: choices})

        if (selectedTransactionID == "quit") {
            return;
        }
        const transactionAction = await select({
            message: "Please select an option", choices: [
                {
                    name: "View comments",
                    value: "view_comments"
                },
                {
                    name: "Add comment",
                    value: "add_comment"
                },
                {
                    name: "View reactions",
                    value: "view_reactions"
                },
                {
                    name: "Add reaction",
                    value: "add_reaction"
                },
                {
                    name: "Quit",
                    value: "quit"
                },
            ]
        })


        if (transactionAction == "add_comment") {
            await addCommentToTransaction(selectedTransactionID, currentUser, await input({
                message: "Enter comment:",
                required: true
            }));
        } else if (transactionAction == "add_reaction") {
            await addReactionToTransaction(selectedTransactionID, currentUser);
        } else if (transactionAction == "view_comments") {
            await printTransactionComments(selectedTransactionID);
        } else if (transactionAction == "view_reactions") {
            await printTransactionReactions(selectedTransactionID);
        } else {
            break;
        }
    }
}

async function terminalCreateTransaction() {
    let allUsers = await db.select({
        value: usersTable.id,
        name: usersTable.first_name
    }).from(usersTable).where(ne(usersTable.id, currentUser.id))
    if (allUsers.length != 0) {
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

        const transactionId = await createTransaction(currentUser.id, recipientIDs, amount, content, visibility as "public" | "friends-only" | "private");
        if (transactionId) {
            await createTransactionRelationship(
                currentUser.id,
                recipientIDs,
                amount,
                transactionId
            );
        }
    } else {
        console.log("No other users are in the database. You cannot make transactions.")
    }

}

async function terminalListGraphUsers() {
    const users = await getAllUsers();

    if (users.length == 0) {
        console.log("No users found.");
        return;
    }

    for (const u of users) {
        console.log(`User ID: ${u.userId} | Username: ${u.username} | Email: ${u.email}`);
    }
}

async function terminalAddFriend() {
    // Get all users from Postgres except the current user
    const allUsers = await db.select({
        value: usersTable.id,
        name: usersTable.first_name,
        email: usersTable.email
    }).from(usersTable).where(ne(usersTable.id, currentUser!.id));

    if (allUsers.length === 0) {
        console.log("No other users to add as friends.");
        return;
    }

    // Label each choice to show if already friends
    const choices = await Promise.all(allUsers.map(async (u) => {
        const already = await areFriends(currentUser!.id, u.value);
        return {
            value: u.value,
            name: already
                ? `${u.name} (${u.email}) — already friends`
                : `${u.name} (${u.email})`,
            disabled: already
        };
    }));

    const available = choices.filter(c => !c.disabled);
    if (available.length === 0) {
        console.log("You are already friends with everyone!");
        return;
    }

    const selectedId = await select({
        message: "Select a user to add as a friend:",
        choices: choices
    });

    await createFriendship(currentUser!.id, selectedId);

    const selectedUser = allUsers.find(u => u.value === selectedId);
    console.log(`You are now friends with ${selectedUser?.name}!`);
}

async function terminalFriendRecommendations() {
    const recs = await getFriendRecommendations(currentUser!.id);

    if (recs.length === 0) {
        console.log("No recommendations yet — add more friends to get suggestions!");
        return;
    }

    console.log("People you might know:");
    for (const r of recs) {
        console.log(`  ${r.username} (${r.email}) — ${r.mutualFriends} mutual friend${r.mutualFriends === 1 ? '' : 's'}`);
    }
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

let currentUser: User;

async function terminalDepositMoney() {
    const amount = await number({message: "Enter deposit amount: ", min: 0.01, step: 0.01, max: 1000});
    const ssn = await input({
        message: "Please confirm your SSN:", validate: (n) => {
            if (createHash("sha256").update(n).digest("hex") != currentUser.ssn_hash) {
                return "SSN does not match!"
            } else return true
        }
    });

    await db.update(usersTable).set({
        balance: sql`${usersTable.balance}
        +
        ${amount}`
    }).where(eq(usersTable.id, currentUser.id))

}

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
                    name: "Add Friend",
                    value: "addFriend"
                },
                {
                    name: "Friend Recommendations",
                    value: "friendRecommendations"
                },
                {
                    name: "List Graph Users",
                    value: "listGraphUsers"
                },
                {
                    name: "Deposit money",
                    value: "depositMoney"
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
        });
        // refresh the current user's information
        if (currentUser != undefined) {
            currentUser = (await db.select().from(usersTable).where(eq(usersTable.email, currentUser.email)))[0]
        }
        switch (answer) {
            case "register": {
                try {
                    await terminalRegisterUser();
                } catch {
                }
                break;
            }
            case "login": {
                try {
                    await terminalLogin();
                } catch {
                }
                break;
            }
            case "createTransaction": {
                try {
                    await terminalCreateTransaction();
                } catch {
                }
                break;
            }
            case "listPublicTransactions": {
                try {
                    await terminalListPublicTransactions();
                } catch {
                }
                break;
            }
            case "listGraphUsers": {
                await terminalListGraphUsers();
                break;
            }
            case "addFriend": {
                await terminalAddFriend();
                break;
            }
            case "friendRecommendations": {
                await terminalFriendRecommendations();
                break;
            }
            case "depositMoney": {
                try {
                    await terminalDepositMoney();
                } catch {
                }
                break;
            }
            case "exit": {
                running = false;
                console.log("Disconnecting from databases...")
                break;
            }
        }
    }

    await disconnectMongo();
    await disconnectNeo4j();
}

await main();
