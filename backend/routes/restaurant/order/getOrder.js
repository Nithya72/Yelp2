"use strict";
const express = require("express");
const Orders = require('../../../models/Orders');
const Customers = require('../../../models/Customers');
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');

router.post('/', async (req, res) => {
    console.log("Req Body - Get Orders: ", req.body);
    try {

        const orders = await Orders.find({ Restaurant: req.body.id });
        console.log(" orders details: ", orders);

        const customers = await Customers.find({ _id: orders.Customer });
        console.log(" customer details: ", customers);

        if(!orders || orders.length == 0){
            return res.status(404).send("No Orders Yet");
        }

        const payload = {
            orders : orders,
            customer: customer
        }
        res.status(200).json(payload);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});
module.exports = router;