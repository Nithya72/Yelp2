"use strict";
const Restaurants = require('../../models/Restaurants');

const handle_request = async (msg, callback) => {
    console.log("Service - update customer profile : ", msg);
    var res = {};

    var data = { "Menu.$.DishImg": msg.fileName}
    const restaurant = await Restaurants.findOneAndUpdate({ _id: msg.restId, "Menu._id" : msg.id}, { $set: data }, {new: true});
    console.log(" dish pic updated details: ", restaurant);

    if (!restaurant) {
        res.status = 404; res.restaurant = "Couldn't update dish pic!";
        callback(null, res);
    } else {
        res.status = 200; res.restaurant = restaurant;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

 