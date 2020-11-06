"use strict";
const Messages = require('../models/Messages');

const handle_request = async (msg, callback) => {
    console.log("Service - load customer messages : ", msg);
    var res = {};

    var data = {sender : msg.sender, message : msg.message, msgTime: new Date()}
    const finalMsg = await Messages.findOneAndUpdate({ _id: msg._id, "customers.id" : msg.custId}, { "$push": {"customers.$.messages": data }}, {new: true});
    
    const messages = await Messages.find({ "customers.id": msg.custId }).sort({ "customers.messages.msgTime" : 1 });

    if (!messages) {
        res.status = 404; res.messages = "Couldn't send message!";
        callback(null, res);
    } else {
        res.status = 200; res.messages = messages;
        callback(null, res);
    }
};
module.exports.handle_request = handle_request;