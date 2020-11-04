"use strict";
const express = require("express");
const Restaurants = require('../../../models/Restaurants');
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');

auth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - customer Sign up : ", req.body);

    console.log("Req Body - Add Menu: ", req.body);
    try {
        var data = { Rating: req.body.rating, Comment: req.body.review, CustomerName: req.body.customerName, ReviewDate: req.body.reviewDate}

        const restaurant = await Restaurants.findByIdAndUpdate({ _id: req.body.restaurantId }, {$push: { Reviews: data }}, {new: true});
        console.log(" posted review details: ", restaurant);

        const restaurants = await Restaurants.find();
        console.log(" restaurants details: ", restaurants);

        res.status(200).json(restaurants);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Post Review");
    }

});
module.exports = router;
