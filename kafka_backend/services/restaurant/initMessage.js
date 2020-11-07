"use strict";
const Messages = require('../../models/Messages');

const handle_request = async (msg, callback) => {
    console.log("Service - get customer orders : ", msg);
    var res = {};

    // let restaurant = {"name": msg.restName, "id":msg.restId}
    let msgs = new Messages({ restName:  msg.restName, restId: msg.restId  });

    let customer = { name: msg.custName, id: msg.custId};
    msgs.customers.push(customer);

    var newMsg = await msgs.save();
    // console.log("primary id: ", newMsg);

    var data = {sender : msg.restName, message : msg.message, msgTime: new Date(), title: msg.title}
    const finalMsg = await Messages.findOneAndUpdate({ _id: newMsg._id, "customers.id" : msg.custId}, { "$push": {"customers.$.messages": data }}, {new: true});    
    // console.log(" Final Message Details: ", finalMsg); 

    if (!finalMsg) {
        res.status = 404; res.finalMsg = "Couldn't send message";
        callback(null, res);
    } else {
        res.status = 200; res.finalMsg = "Chat Initiated!";
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

