"use strict";
const Orders = require('../../models/Orders');
const Customers = require('../../models/Customers');


const handle_request = async (msg, callback) => {
    console.log("Service - get customer orders : ", msg);
    var res = {};

    const orders = await Orders.find({ Restaurant: msg }).populate({ path: 'Customer', select: ['CustName', '_id', 'CustPic'], model : Customers });
    // console.log(" orders details: ", orders);

    if (!orders) {
        res.status = 404; res.orders = "No Orders Yet";
        callback(null, res);
    } else {
        res.status = 200; res.orders = orders;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

