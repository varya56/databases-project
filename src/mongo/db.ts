import mongoose from "mongoose"
import 'dotenv/config';
import {Transaction} from "./models/transaction";
import type {User} from "../postgres/db.ts";


export async function connectToMongo() {
    mongoose.set('bufferCommands', false);
    return await mongoose.connect(process.env.MONGO_URL!);
}


export async function disconnectMongo() {
    await mongoose.disconnect();
}

export async function createTransaction(sender_id: number, recipient_ids: number[], amount: number, content: string, visibility: "public" | "friends-only" | "private") {
    try {
        const t = await Transaction.create({
            sender: sender_id,
            recipients: recipient_ids,
            amount: amount,
            content: content,
            visibility: visibility
        });
        return t._id.toString();
    } catch (err) {
        console.log("Could not create transaction: " + err);
        return null;
    }
}

export const unknownUser: User = {
    id: 1,
    first_name: "Unknown",
    last_name: "User",
    email: "unknown@example.com",
    balance: "0.00",
    ssn_hash: "0",
    status: "active",
    password_hash: "-"

}