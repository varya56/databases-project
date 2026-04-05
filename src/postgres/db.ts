import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import {usersTable} from './schema';
import {eq} from "drizzle-orm"

export type User = typeof usersTable.$inferSelect;

export const db = drizzle(process.env.POSTGRES_URL!);

export async function findUserByEmail(email: string): Promise<User | undefined> {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user[0];
}

export async function getUserFromID(id: number): Promise<User | undefined> {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (user == undefined || user.length == 0) return;
    return user[0];

}