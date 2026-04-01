import {usersTable} from './postgres/schema';
import {db} from "./postgres/db"
import {eq} from "drizzle-orm"
import {connectToMongo, disconnectMongo} from "./mongo/db.ts";
import {Transaction} from "./mongo/models/transaction";
import {createHash} from "crypto"

type User = typeof usersTable.$inferSelect;

async function createUser(first_name: string, last_name: string, email: string, ssn: string) {
    await db.insert(usersTable)
        .values({
            first_name: first_name,
            last_name: last_name,
            email: email,
            ssn_hash: createHash("sha256").update(ssn).digest("hex")
        })
        .onConflictDoNothing()
        .returning({id: usersTable.id});
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

/**
 * Finds one user by their email.
 * @param email
 */
async function findUserByEmail(email: string): Promise<User | undefined> {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (user.length == 0) {
        return undefined;
    }
    return user[0];
}

async function main() {
    await connectToMongo();

    // const users = await db.select().from(usersTable);
    // console.log('Getting all users from the database: ', users)


    const user1 = await findUserByEmail("hayden@example.com")
    if (!user1) {
        console.log("Could not find user1.")
        return;
    }

    const user2 = await findUserByEmail("test@example.com")
    if (!user2) {
        console.log("Could not find user2.")
        return;
    }

    // make a transaction between these two users
    await createTransaction(user1.id, [user2.id], "Test transaction!", "public");
    //
    // get transactions created by user 1
    const user1_transactions = await Transaction.find({sender: user1.id})
    console.log(user1_transactions);

    await disconnectMongo();


}

await main();
