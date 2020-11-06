"use strict";
const Messages = require('../models/Messages');

const handle_request = async (msg, callback) => {
    console.log("Service - load customer messages : ", msg);
    var res = {};

    const messages = await Messages.find({ "customers.id": req.params.id }).sort({ "customers.messages.msgTime" : 1 });
    console.log("Get messages - Customer: ", messages);

    if (!messages) {
        res.status = 404; res.messages = "No conversations yet";
        callback(null, res);
    } else {
        res.status = 200; res.messages = messages;
        callback(null, res);
    }
};
module.exports.handle_request = handle_request;