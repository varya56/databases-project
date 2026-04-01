import {model, Schema} from "mongoose"

const transactionSchema = new Schema({
    sender: Number,
    recipients: [Number],
    content: String,
    visibility: String,
    // comments: [{
    //     user: String,
    //     content: String,
    //     votes: Number
    // }]
}, {
    timestamps: true
});

const Transaction = model('Transaction', transactionSchema);

export {Transaction};