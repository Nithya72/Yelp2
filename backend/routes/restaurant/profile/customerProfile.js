"use strict";
const express = require("express");
const Customers = require('../../../models/Customers');
const router = express.Router();
const { checkAuth, resAuth } = require('../../../utils/passport');

resAuth();

router.get('/:id', checkAuth, async (req, res) => {
    console.log("Req Body - Customer Profile : ", req.params.id);

    try {

        const customer = await Customers.findById(req.params.id);
        console.log(" customer details: ", customer);

        res.status(200).json(customer);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error");
    }

});
module.exports = router;