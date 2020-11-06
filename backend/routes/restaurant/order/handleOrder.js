"use strict";
const express = require("express");
const Orders = require('../../../models/Orders');
const Customers = require('../../../models/Customers');
const router = express.Router();
const { checkAuth, resAuth } = require('../../../utils/passport');

resAuth();

router.get('/:id', checkAuth, async (req, res) => {
    console.log("Req Body - Get Orders: ", req.params.id);
    try {

        const orders = await Orders.find({ Restaurant: req.params.id }).populate({ path: 'Customer', select: ['CustName', '_id', 'CustPic'], model : Customers });
        console.log(" orders details: ", orders);

        if(!orders || orders.length == 0){
            return res.status(404).send("No Orders Yet");
        }

        res.status(200).json(orders);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Update Orders Status: ", req.body);
    try {
        const updatedOrder = await Orders.findOneAndUpdate({ _id: req.body.orderId }, { OrderStatus: req.body.status}, { new: true });
        console.log(" customer updated details: ", updatedOrder);

        const orders = await Orders.find({ Restaurant: req.body.id }).populate({ path: 'Customer', select: ['CustName', '_id', 'CustPic'], model : Customers });
        console.log(" orders details: ", orders);

        res.status(200).json(orders);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});
module.exports = router;
