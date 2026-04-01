import {usersTable} from './schema';
import {db} from "./db"
import {reset, seed} from "drizzle-seed";
import {createHash} from "crypto";


async function main() {
    await reset(db, {usersTable});

    await seed(db, {usersTable}).refine((f) => ({
        usersTable: {
            columns: {
                ssn_hash: f.string(),
                balance: f.number({maxValue: 5000.00})
            },
            count: 2
        }
    }));

    await db.insert(usersTable).values({
        email: "hayden@example.com",
        first_name: "Hayden",
        last_name: "Example",
        ssn_hash: createHash("sha256").update("111-22-3333").digest("hex")
    });

    await db.insert(usersTable).values({
        email: "test@example.com",
        first_name: "John",
        last_name: "Example",
        ssn_hash: createHash("sha256").update("111-22-3334").digest("hex")
    });

    console.log('Added example data!')
}

await main();
