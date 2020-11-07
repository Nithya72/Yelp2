"use strict";
const Messages = require('../../models/Messages');

const handle_request = async (msg, callback) => {
    console.log("Service - send messgae : ", msg);
    var res = {};

    var data = {sender : msg.sender, message : msg.message, msgTime: new Date()}
    const finalMsg = await Messages.findOneAndUpdate({ _id: msg._id, "customers.id" : msg.custId}, { "$push": {"customers.$.messages": data }}, {new: true});

    if (!finalMsg) {
        res.status = 404; res.messages = "Couldn't send message";
        callback(null, res);
    } else {
        const messages = await Messages.find({  restId: msg.restId  }).sort({ "customers.messages.msgTime" : 1 });
        // console.log(" added new chat from customer: ", messages);
        
        res.status = 200; res.messages = messages;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

