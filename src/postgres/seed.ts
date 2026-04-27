import {usersTable} from './schema';
import {db} from "./db"
import {hash} from "bcrypt"


export async function PostgresSeed() {

    await db.insert(usersTable).values({
        email: "hayden@example.com",
        first_name: "Hayden",
        last_name: "Example",
        ssn_hash: await hash("000-00-0001", 10),
        balance: "50.00",
        status: "active",
        password_hash: await hash("password", 10)
    }).onConflictDoNothing();

    await db.insert(usersTable).values({
        email: "varvara@example.com",
        first_name: "Varvara",
        last_name: "Example",
        ssn_hash: await hash("000-00-0002", 10),
        balance: "250.00",
        status: "active",
        password_hash: await hash("password", 10)
    }).onConflictDoNothing();

    await db.insert(usersTable).values({
        email: "jake@example.com",
        first_name: "Jake",
        last_name: "Example",
        ssn_hash: await hash("000-00-0003", 10),
        balance: "100.00",
        status: "active",
        password_hash: await hash("password", 10)
    }).onConflictDoNothing();

}

//await PostgresSeed();
console.log('Added postgres data!')
