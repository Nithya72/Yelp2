const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
    restName: { type: String },
    restId: { type: String },
    customers: [{
        name: { type: String },
        id: { type: String },
        messages: [{
            title: {type: String},
            sender: { type: String },
            message: { type: String },
            msgTime: { type: Date },
        }]
    }]
})

const Messages = mongoose.model('messages', MessagesSchema);
module.exports = Messages;
