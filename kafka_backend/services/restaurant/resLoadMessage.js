"use strict";
const Messages = require('../../models/Messages');

const handle_request = async (msg, callback) => {
    console.log("Service - load messgae : ", msg);
    var res = {};

    const messages = await Messages.find({ restId: msg}).sort({ "customers.messages.msgTime" : 1 });  
    // console.log("Get messages - Restaurant: ", messages);

    if (!messages) {
        res.status = 404; res.messages = "Couldn't load message";
        callback(null, res);
    } else {
        res.status = 200; res.messages = messages;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

