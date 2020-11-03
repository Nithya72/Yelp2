"use strict";
const express = require("express");
const Customers = require('../../../models/Customers');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/:id', async (req, res) => {
    console.log("Req Body - get yelp users : ", req.params.id);

    try {
        const customers = await Customers.find({_id: {$ne: req.params.id}});
        console.log(" customers details: ", customers);

        res.status(200).json(customers);
    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error");
    }

});


router.post('/', async (req, res) => {
    console.log("Req Body - follow yelp users : ", req.body);

    try {
        const updated = await Customers.findOneAndUpdate({_id: req.body.custId }, { $push: {Following: req.body.userId} });
        const customers = await Customers.find({_id: {$ne: req.body.custId}});
        console.log(" customers details: ", customers);

        res.status(200).json(customers);
    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error");
    }

});
module.exports = router;


