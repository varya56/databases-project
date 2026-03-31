import {connect, model} from "mongoose"
import {Transaction} from "./models/transaction"

const mongodb_connection = connect("mongodb://root:example@localhost:27017/");

export {mongodb_connection};
// async function main() {
//     await connect("mongodb://root:example@localhost:27017/");
//
//     // Creates a new blog post and inserts it into database
//     const article = await Transaction.create({
//         sender: 1,
//         recipients: [2],
//         content: 'This is the best post ever',
//         tags: ['featured', 'announcement'],
//     });
//
//     console.log('Created transaction:', article);
//
//     const transactions = await Transaction.find();
//     console.log(transactions);
// }
//
// await main();
