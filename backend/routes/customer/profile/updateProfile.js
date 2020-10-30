"use strict";
const express = require("express");
const path = require("path");
const multer = require("multer");
const Customers = require('../../../models/Customers');
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');

router.post('/', async (req, res) => {
    console.log("Req Body - update Customer : ", req.body);
    try {
        var data = { CustName: req.body.CustName, NickName: req.body.NickName, CustomerDOB: req.body.CustomerDOB, CustEmailId: req.body.CustEmailId, CustomerPhoneNo: req.body.CustomerPhoneNo, CustomerCity:req.body.CustomerCity, CustomerState: req.body.CustomerState, CustomerCountry: req.body.CustomerCountry, YelpingSince: req.body.YelpingSince, ThingsLove: req.body.ThingsLove,  FindMeIn: req.body.FindMeIn, MyBlog: req.body.MyBlog}

        const customer = await Customers.findOneAndUpdate({ _id: req.body._id }, data, { new: true });
        console.log(" customer updated details: ", customer);

        res.status(200).json(customer);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Update Customer");
    }

});
module.exports = router;