"use strict";
const Events = require('../../models/Events');
const Customers = require('../../models/Customers')

const handle_request = async (msg, callback) => {
    console.log("Service - get res events : ", msg);
    var res = {};

    const events = await Events.find({ Restaurant: msg.id }).populate({ path: 'RegisteredUsers', select: ['_id', 'CustName'], model: Customers });
    // console.log(" events details: ", events);

    if (!events) {
        res.status = 404; res.events = "No Events Posted Yet";
        callback(null, res);
    } else {
        res.status = 200; res.events = events;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

