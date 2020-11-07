"use strict";
const Events = require('../../models/Events');

const handle_request = async (msg, callback) => {
    console.log("Service - get registered events : ", msg);
    var res = {};

    const events = await Events.find({ RegisteredUsers: { $in : [msg]} });
    console.log("Get Registered Events: ", events);

    if (!events) {
        res.status = 404; res.events = "No events registered yet";
        callback(null, res);
    } else {
        res.status = 200; res.events = events;
        callback(null, res);
    }
};
module.exports.handle_request = handle_request;

