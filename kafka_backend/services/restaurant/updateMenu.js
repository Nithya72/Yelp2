"use strict";
const Restaurants = require('../../models/Restaurants');

const handle_request = async (msg, callback) => {
    console.log("Service - update : ", msg);
    var res = {};

    var data = { "Menu.$.DishName": msg.dish.DishName, "Menu.$.DishPrice": msg.dish.DishPrice, "Menu.$.Cuisine": msg.dish.Cuisine,  "Menu.$.DishMainIngd": msg.dish.DishMainIngd, "Menu.$.DishImg": msg.dish.DishImg, "Menu.$.DishCategory": msg.dish.DishCategory, "Menu.$.DishDescription": msg.dish.DishDescription }
    
    const restaurant = await Restaurants.findOneAndUpdate({ _id: msg.restaurantId, "Menu._id" : msg.dish._id}, { $set: data }, {new: true});
    console.log(" updated menu details: ", restaurant);


    if (!restaurant) {
        res.status = 404; res.restaurant = "Couldn't add menu";
        callback(null, res);
    } else {
        res.status = 200; res.restaurant = restaurant;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

