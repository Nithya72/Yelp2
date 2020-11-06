"use strict";
const express = require("express");
const Events = require('../../../models/Events');
const { ObjectId } = require("mongodb");
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');

auth();

router.get('/', checkAuth, async (req, res) => {

    try {
        const events = await Events.find();
        console.log("Get All Events: ", events);

        res.status(200).json(events);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});
module.exports = router;