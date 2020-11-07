"use strict";
const Orders = require('../../models/Orders');


const handle_request = async (msg, callback) => {
    console.log("Service - place orders : ", msg);
    var res = {};

    let orders = new Orders({ Restaurant: msg.restaurant, Customer:msg.customer, OrderAmount: msg.orderAmount, OrderTime: new Date() , OrderDishes:msg.orders , OrderStatus: msg.orderStatus, DeliveryOption: msg.deliveryOption});
    await orders.save();

    if (!orders) {
        res.status = 404; res.orderMsg = "Couldn't place order, try after sometime";
        callback(null, res);
    } else {
        res.status = 200; res.orderMsg = "Order placed successfully!";
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

