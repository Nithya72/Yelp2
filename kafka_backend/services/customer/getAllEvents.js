"use strict";
const Events = require('../models/Events');

const handle_request = async (msg, callback) => {
    console.log("Service - register to events : ", msg);
    var res = {};

    const events = await Events.find();    

    if (!events) {
        res.status = 404; res.events = "No upcoming events!";
        callback(null, res);
    } else {
        res.status = 200; res.events = events;
        callback(null, res);
    }
};
module.exports.handle_request = handle_request;

