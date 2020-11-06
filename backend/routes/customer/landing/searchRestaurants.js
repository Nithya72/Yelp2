"use strict";
const express = require("express");
const Restaurants = require('../../../models/Restaurants');
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');

auth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Search Restaurants: ", req.body);
    try {

        const restaurants = await Restaurants.find({ $and: 
            [{ $or: 
                [   { RestName: {'$regex' : req.body.searchName, '$options' : 'i'}}, 
                    { "Menu.DishName": {'$regex' : req.body.searchName, '$options' : 'i'}},  
                    { Cuisine: {'$regex' : req.body.searchName, '$options' : 'i'}} ] }, 
                    
                { Location: {'$regex' : req.body.searchLocation, '$options' : 'i'} }
                ]
            });

        console.log(" search results: ", restaurants);

        if (!restaurants || restaurants.length == 0) {
            return res.status(404).send("No Search Result Found");
        }
        res.status(200).send(restaurants);
    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});
module.exports = router;
