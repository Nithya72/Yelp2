"use strict";
const Customers = require('../../models/Customers');


const handle_request = async (msg, callback) => {
    console.log("Service - get customer details : ", msg);
    var res = {};

    const customer = await Customers.findById(msg);
    // console.log(" customer details: ", customer);

    if (!customer) {
        res.status = 404; res.customer = "No Customer Found!";
        callback(null, res);
    } else {
        res.status = 200; res.customer = customer;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

