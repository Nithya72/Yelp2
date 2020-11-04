"use strict";
const express = require("express");
const Events = require('../../../models/Events');
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');

auth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Get Orders: ", req.body);
    try {
        const events = await Events.findByIdAndUpdate({ _id: req.body.RegEventId }, {$push: { RegisteredUsers: req.body.RegCustomerId }}, {new: true});
        console.log("updated events:", events);
        res.status(200).send('You are now succesfully registered!');
    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});

router.get('/:id', checkAuth, async (req, res) => {

    try {
        console.log("customer id:", req.params.id);

        const events = await Events.find({ RegisteredUsers: { $in : [req.params.id]} });
        console.log("Get Registered Events: ", events);

        res.status(200).json(events);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});

module.exports = router;
