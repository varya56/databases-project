import {usersTable} from './schema';
import {db} from "./db"
import {createHash} from "crypto";


export async function PostgresSeed() {

    await db.insert(usersTable).values({
        email: "hayden@example.com",
        first_name: "Hayden",
        last_name: "Example",
        ssn_hash: createHash("sha256").update("000-00-0001").digest("hex"),
        balance: "50.00",
        status: "active",
        password_hash: createHash("sha256").update("test").digest("hex")
    }).onConflictDoNothing();

    await db.insert(usersTable).values({
        email: "varvara@example.com",
        first_name: "Varvara",
        last_name: "Example",
        ssn_hash: createHash("sha256").update("000-00-0003").digest("hex"),
        balance: "250.00",
        status: "active",
        password_hash: createHash("sha256").update("test").digest("hex")
    }).onConflictDoNothing();

    await db.insert(usersTable).values({
        email: "jake@example.com",
        first_name: "Jake",
        last_name: "Example",
        ssn_hash: createHash("sha256").update("000-00-0002").digest("hex"),
        balance: "100.00",
        status: "active",
        password_hash: createHash("sha256").update("test").digest("hex")
    }).onConflictDoNothing();

}

//await PostgresSeed();
console.log('Added postgres data!')
