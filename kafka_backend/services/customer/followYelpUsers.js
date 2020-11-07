"use strict";
const Customers = require('../../models/Customers');

const handle_request = async (msg, callback) => {
    console.log("Service - follow yelp users : ", msg);
    var res = {};

    const updated = await Customers.findOneAndUpdate({_id: msg.custId }, { $push: {Following: msg.userId}}, {new: true});
    const customers = await Customers.find({_id: {$ne: msg.custId}});
    // console.log(" customers details: ", customers);

    if (!customers) {
        res.status = 404; res.customers = "couldn't follow the user!";
        callback(null, res);
    } else {
        res.status = 200; res.customers = customers; res.updated = updated;
        callback(null, res);
    }
};
module.exports.handle_request = handle_request;

