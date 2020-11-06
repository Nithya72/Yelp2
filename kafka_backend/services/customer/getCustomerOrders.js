"use strict";
const Orders = require('../models/Orders');


const handle_request = async (msg, callback) => {
    console.log("Service - get customer orders : ", msg);
    var res = {};

    const orders = await Orders.find({ Customer: msg }).populate({ path: 'Restaurant', select: ['RestName', 'ProfilePic'], model: Restaurants });

    if (!orders) {
        res.status = 404; res.orders = "No orders placed yet";
        callback(null, res);
    } else {
        res.status = 200; res.orders = orders;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

