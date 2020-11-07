"use strict";
const Restaurants = require('../../models/Restaurants');

const handle_request = async (msg, callback) => {
    console.log("Service - add menu : ", msg);
    var res = {};

    var data = { DishName: msg.dish.DishName, DishPrice: msg.dish.DishPrice, Cuisine: msg.dish.Cuisine, DishMainIngd: msg.dish.DishMainIngd, DishImg: msg.dish.DishImg, DishCategory: msg.dish.DishCategory, DishDescription: msg.dish.DishDescription }

    const restaurant = await Restaurants.findByIdAndUpdate({ _id: msg.restaurantId }, {$push: { Menu: data }}, {new: true});
    console.log(" added menu details: ", restaurant);


    if (!restaurant) {
        res.status = 404; res.restaurant = "Couldn't add menu";
        callback(null, res);
    } else {
        res.status = 200; res.restaurant = restaurant;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

