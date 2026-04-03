import { char, decimal, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const accountStatusEnum = pgEnum('account_status', ['active', 'suspended']);

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    first_name: varchar({ length: 255 }).notNull(),
    last_name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    balance: decimal({ precision: 19, scale: 2 }).default("0.00").notNull(),
    ssn_hash: char({ length: 64 }).notNull().unique(),
    status: accountStatusEnum().default("active").notNull(),
    password_hash: char({ length: 64 }).notNull(),
});
