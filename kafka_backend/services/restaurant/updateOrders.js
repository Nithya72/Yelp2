"use strict";
const Orders = require('../../models/Orders');
const Customers = require('../../models/Customers');


const handle_request = async (msg, callback) => {
    console.log("Service - get customer orders : ", msg);
    var res = {};

    const updatedOrder = await Orders.findOneAndUpdate({ _id: msg.orderId }, { OrderStatus: msg.status}, { new: true });
    // console.log(" customer updated details: ", updatedOrder);

    if (!updatedOrder) {
        res.status = 404; res.orders = "Couldn't update order status";
        callback(null, res);
    } else {
        const orders = await Orders.find({ Restaurant: msg.id }).populate({ path: 'Customer', select: ['CustName', '_id', 'CustPic'], model : Customers });
        // console.log(" orders details: ", orders);

        res.status = 200; res.orders = orders;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

