"use strict";
const Events = require('../../models/Events');


const handle_request = async (msg, callback) => {
    console.log("Service - get res events : ", msg);
    var res = {};

    let events = new Events({ Restaurant: msg.eventDetails.eventRestId, EventName:msg.eventDetails.eventName, EventDescription: msg.eventDetails.eventDescription, EventDate:msg.eventDetails.eventDate , EventTime: msg.eventDetails.eventTime, EventPlace: msg.eventDetails.eventLocation, EventHashtag: msg.eventDetails.eventHashtag, EventContactNo: msg.eventDetails.eventContactNo, EventType: msg.eventDetails.eventType});
    await events.save();

    res.status = 200; res.eventMsg = "You have successfully posted!";
    callback(null, res);
};

module.exports.handle_request = handle_request;

