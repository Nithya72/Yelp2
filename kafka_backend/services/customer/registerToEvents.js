"use strict";
const Events = require('../models/Events');

const handle_request = async (msg, callback) => {
    console.log("Service - register to events : ", msg);
    var res = {};

    const events = await Events.findByIdAndUpdate({ _id: msg.RegEventId }, {$push: { RegisteredUsers: msg.RegCustomerId }}, {new: true});

    if (!events) {
        res.status = 404; res.eventMsg = "Couldn't register, try after sometime";
        callback(null, res);
    } else {
        res.status = 200; res.eventMsg = "You have succesfully registered!!";
        callback(null, res);
    }
};
module.exports.handle_request = handle_request;

