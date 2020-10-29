"use strict";
const express = require("express");
const Events = require('../../../models/Events');
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');

router.post('/', async (req, res) => {
    console.log("Req Body - Get Events: ", req.body);
    try {

        const events = await Events.find({ Restaurant: req.body.id });
        console.log(" events details: ", events);

        if (!events || events.length == 0) {
            return res.status(404).send("No Events Posted Yet");
        }
        res.status(200).send(events);
    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Menu");
    }

});
module.exports = router;
