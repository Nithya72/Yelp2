"use strict";
const express = require("express");
const path = require("path");
const multer = require("multer");
const Restaurants = require('../../../models/Restaurants');
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');

router.post('/', async (req, res) => {
    console.log("Req Body - update Restaurant : ", req.body);
    try {
        var data = { RestName: req.body.RestName, Location: req.body.Location, Description: req.body.Description, RestPhoneNo: req.body.RestPhoneNo, RestTimings: req.body.RestTimings }

        const restaurant = await Restaurants.findOneAndUpdate({ _id: req.body._id }, data, { new: true });
        console.log(" restaurant updated details: ", restaurant);

        res.status(200).json(restaurant);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Update Restaurant");
    }

});
module.exports = router;