import {usersTable} from './postgres/schema';
import {db} from "./postgres/db"
import {eq} from "drizzle-orm"
import {mongodb_connection} from "./mongo/db.ts";
import {Transaction} from "./mongo/models/transaction";


async function main() {
    await mongodb_connection;
    // run npx drizzle-kit push to push the schema to the database
    // then run node src/postgres/seed.ts to seed the data.

    // const users = await db.select().from(usersTable);
    // console.log('Getting all users from the database: ', users)


    const user1 = await db.select().from(usersTable).where(eq(usersTable.email, 'hayden@example.com'));
    console.log(user1);

    const user2 = await db.select().from(usersTable).where(eq(usersTable.email, 'test@example.com'));
    console.log(user2);


    // make a transaction between these two users
    await Transaction.create({
        sender: user1[0].id,
        recipients: [user2[0].id],
        content: "test content"
    })
    console.log("Created transaction.");

    // get transactions created by user 1
    const user1_transactions = await Transaction.find({sender: user1[0].id})
    console.log(user1_transactions);


}

main();
