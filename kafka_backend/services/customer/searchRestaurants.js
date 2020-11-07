"use strict";
const Restaurants = require('../../models/Restaurants');

const handle_request = async (msg, callback) => {
    console.log("Req Body - customerLogin : ", msg);
    var res = {};

    const restaurants = await Restaurants.find({ $and: 
                [{ $or: 
                    [   { RestName: {'$regex' : msg.searchName, '$options' : 'i'}}, 
                        { "Menu.DishName": {'$regex' : msg.searchName, '$options' : 'i'}},  
                        { Cuisine: {'$regex' : msg.searchName, '$options' : 'i'}} ] }, 
                        
                    { Location: {'$regex' : msg.searchLocation, '$options' : 'i'} }
                    ]
                });

    console.log(" search results: ", restaurants);

    if (!restaurants || restaurants.length == 0) {
        res.status = 404; res.restaurants = "No Search Result Found";
        callback(null, res);
    }else{
        res.status = 200; res.restaurants = restaurants;
        callback(null, res);
    } 
    };

module.exports.handle_request = handle_request;