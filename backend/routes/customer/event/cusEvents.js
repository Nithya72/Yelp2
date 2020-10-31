"use strict";
const express = require("express");
const Events = require('../../../models/Events');
const { ObjectId } = require("mongodb");
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');

router.post('/', async (req, res) => {
    console.log("Req Body - Get Orders: ", req.body);
    try {

        var data = { DishName: req.body.dish.DishName, DishPrice: req.body.dish.DishPrice, Cuisine: req.body.dish.Cuisine, DishMainIngd: req.body.dish.DishMainIngd, DishImg: req.body.dish.DishImg, DishCategory: req.body.dish.DishCategory, DishDescription: req.body.dish.DishDescription }

        const event = await Events.findByIdAndUpdate({ _id: req.body.RegEventId }, {$push: { RegisteredUsers: req.body.RegCustomerId }}, {new: true});
   
        res.status(200).send('You are now succesfully registered!');

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});


router.get('/', async (req, res) => {

    try {

        const events = await Events.find();
        console.log("Get Events: ", events);

        res.status(200).json(events);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});
module.exports = router;