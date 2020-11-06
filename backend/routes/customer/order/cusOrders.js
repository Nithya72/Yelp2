"use strict";
const express = require("express");
const Orders = require('../../../models/Orders');
const Restaurants = require("../../../models/Restaurants");
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');

auth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Get Orders: ", req.body);
    try {

        let orders = new Orders({ Restaurant: req.body.restaurant, Customer:req.body.customer, OrderAmount: req.body.orderAmount, OrderTime: new Date() , OrderDishes:req.body.orders , OrderStatus: req.body.orderStatus, DeliveryOption: req.body.deliveryOption});
        await orders.save();

        res.status(200).send('Order placed successfully!');

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});


router.get('/:id', checkAuth, async (req, res) => {

    console.log("Req Body - Get Orders: ", req.params.id);
    try {

        const orders = await Orders.find({ Customer: req.params.id }).populate({ path: 'Restaurant', select: ['RestName', 'ProfilePic'], model: Restaurants });

        console.log("Get Orders: ", orders);

        res.status(200).json(orders);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});
module.exports = router;