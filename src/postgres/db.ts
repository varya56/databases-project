import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import {usersTable} from './schema';
import {eq} from "drizzle-orm"
import {unknownUser} from "../mongo/db.ts";
import {hash} from "bcrypt";

export type User = typeof usersTable.$inferSelect;

export const db = drizzle(process.env.POSTGRES_URL!);

export async function findUserByEmail(email: string): Promise<User | undefined> {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user[0];
}

export async function getUserFromID(id: number): Promise<User> {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (user == undefined || user.length == 0) return unknownUser;
    // @ts-ignore
    return user[0];
}

export async function createUser(first_name: string, last_name: string, email: string, ssn: string, pw: string) {
    const result = await db.insert(usersTable)
        .values({
            first_name,
            last_name,
            email,
            ssn_hash: await hash(ssn, 10),
            password_hash: await hash(pw, 10)
        })
        .onConflictDoNothing()
        .returning();
    return result[0];
}