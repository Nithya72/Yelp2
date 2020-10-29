"use strict";
const express = require("express");
const Events = require('../../../models/Events');
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');

router.post('/', async (req, res) => {
    console.log("Req Body - Add Event: ", req.body);
    try {

        let events = new Events({ Restaurant: req.body.eventDetails.eventRestId, EventName:req.body.eventDetails.eventName, EventDescription: req.body.eventDetails.eventDescription, EventDate:req.body.eventDetails.eventDate , EventTime: req.body.eventDetails.eventTime, EventPlace: req.body.eventDetails.eventLocation, EventHashtag: req.body.eventDetails.eventHashtag, EventContactNo: req.body.eventDetails.eventContactNo, EventType: req.body.eventDetails.eventType});
        await events.save();
        res.status(200).send('You have successfully posted!');

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Event");
    }

});

module.exports = router;
