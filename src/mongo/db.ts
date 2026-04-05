import mongoose from "mongoose"
import 'dotenv/config';
import { Transaction } from "./models/transaction";


export async function connectToMongo() {
    mongoose.set('bufferCommands', false);
    return await mongoose.connect(process.env.MONGO_URL!);
}


export async function disconnectMongo() {
    await mongoose.disconnect();
}

export async function createTransaction(sender_id: number, recipient_ids: [number], amount: number, content: string, visibility: "public" | "friends-only" | "private") {
    try {
        await Transaction.create({
            sender: sender_id,
            recipients: recipient_ids,
            amount: amount,
            content: content,
            visibility: visibility
        });
    } catch (err) {
        console.log("Could not create transaction: " + err);
    }
}