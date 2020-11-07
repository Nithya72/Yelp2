"use strict";
const Restaurants = require('../../models/Restaurants');

const handle_request = async (msg, callback) => {
    console.log("Service - update customer profile : ", msg);
    var res = {};

    var data = { ProfilePic: msg.fileName}
    const restaurant = await Restaurants.findOneAndUpdate({ _id: msg.id }, data, { new: true });
    console.log(" restaurant updated details: ", restaurant);

    if (!restaurant) {
        res.status = 404; res.restaurant = "Couldn't update try after sometime";
        callback(null, res);
    } else {
        res.status = 200; res.restaurant = restaurant;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

 