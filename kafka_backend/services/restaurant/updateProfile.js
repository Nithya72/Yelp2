"use strict";
const Restaurants = require('../../models/Restaurants');


const handle_request = async (msg, callback) => {
    console.log("Service - get customer orders : ", msg);
    var res = {};

    var data = { RestName: msg.RestName, Location: msg.Location, Description: msg.Description, RestPhoneNo: msg.RestPhoneNo, RestTimings: msg.RestTimings }

    const restaurant = await Restaurants.findOneAndUpdate({ _id: msg._id }, data, { new: true });
    console.log(" restaurant updated details: ", restaurant);

    if (!restaurant) {
        res.status = 404; res.restaurant = "Couldn't update restaurant profile";
        callback(null, res);
    } else {
        res.status = 200; res.restaurant = restaurant;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

