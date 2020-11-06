"use strict";
const Restaurants = require('../models/Restaurants');

const handle_request = async (msg, callback) => {
    console.log("Service - post reveiws : ", msg);
    var res = {};
    var data = { Rating: msg.rating, Comment: msg.review, CustomerName: msg.customerName, ReviewDate: msg.reviewDate}

    const restaurant = await Restaurants.findByIdAndUpdate({ _id: msg.restaurantId }, {$push: { Reviews: data }}, {new: true});
    const restaurants = await Restaurants.find();

    if (!restaurants) {
        res.status = 404; res.restaurants = "Couldnt post reviews now";
        callback(null, res);
    } else {
        res.status = 200; res.restaurants = restaurants;
        callback(null, res);
    }
};
module.exports.handle_request = handle_request;

