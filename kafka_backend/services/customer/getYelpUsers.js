"use strict";
const Customers = require('../../models/Customers');

const handle_request = async (msg, callback) => {
    console.log("Service - get yelp users : ", msg);
    var res = {};

    const customers = await Customers.find({_id: {$ne: msg}});
    // console.log(" customers details: ", customers);

    if (!customers) {
        res.status = 404; res.customers = "No users registered!";
        callback(null, res);
    } else {
        res.status = 200; res.customers = customers;
        callback(null, res);
    }
};
module.exports.handle_request = handle_request;

