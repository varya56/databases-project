import {connectToMongo, disconnectMongo} from "./db.ts";
import {Transaction} from "./models/transaction";

export async function MongoSeed() {
    await connectToMongo();
    await Transaction.insertOne({
        recipients: [2],
        content: "This is an example transaction.",
        sender: 1,
        amount: 150.00,
        visibility: "public"
    })
    await Transaction.insertOne({
        recipients: [1, 3],
        content: "This is a second example transaction.",
        sender: 2,
        amount: 50.00,
        visibility: "public"
    })
    await disconnectMongo();

}

//await MongoSeed()
console.log("Added mongo data!");