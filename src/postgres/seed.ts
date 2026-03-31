import { usersTable } from './schema';
import { db } from "./db"
import { createHash } from "crypto"


async function main() {
    await db.insert(usersTable)
        .values({ first_name: "John", last_name: "Smith", email: "test@example.com", ssn_hash: createHash("sha256").update("000-11-2345").digest("hex") })
        .onConflictDoNothing();
    await db.insert(usersTable)
        .values({ first_name: "Hayden", last_name: "Smith", email: "hayden@example.com", ssn_hash: createHash("sha256").update("000-11-2346").digest("hex") })
        .onConflictDoNothing();
    console.log('DB seeded!')
}
main();
