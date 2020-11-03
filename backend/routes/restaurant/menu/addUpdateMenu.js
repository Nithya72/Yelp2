"use strict";
const express = require("express");
const Events = require('../../../models/Events');
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');

router.post('/', async (req, res) => {
    console.log("Req Body - Add Menu: ", req.body);
    try {
        var data = { DishName: req.body.dish.DishName, DishPrice: req.body.dish.DishPrice, Cuisine: req.body.dish.Cuisine, DishMainIngd: req.body.dish.DishMainIngd, DishImg: req.body.dish.DishImg, DishCategory: req.body.dish.DishCategory, DishDescription: req.body.dish.DishDescription }

        const restaurant = await Events.findByIdAndUpdate({ _id: req.body.restaurantId }, {$push: { Menu: data }}, {new: true});
        console.log(" added menu details: ", restaurant);

        res.status(200).json(restaurant);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});


router.post('/update', async (req, res) => {
    console.log("Req Body - Add Menu: ", req.body);
    try {
       var data = { "Menu.$.DishName": req.body.dish.DishName, "Menu.$.DishPrice": req.body.dish.DishPrice, "Menu.$.Cuisine": req.body.dish.Cuisine,  "Menu.$.DishMainIngd": req.body.dish.DishMainIngd, "Menu.$.DishImg": req.body.dish.DishImg, "Menu.$.DishCategory": req.body.dish.DishCategory, "Menu.$.DishDescription": req.body.dish.DishDescription }
    
        const restaurant = await Restaurants.findOneAndUpdate({ _id: req.body.restaurantId, "Menu._id" : req.body.dish._id}, { $set: data }, {new: true});
        console.log(" updated menu details: ", restaurant);

        res.status(200).json(restaurant);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});
module.exports = router;