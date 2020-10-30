"use strict";
const express = require("express");
const Customers = require('../../../models/Customers');
const Restaurants = require('../../../models/Restaurants');
const jwt = require('jsonwebtoken');
const router = express.Router();
var crypto = require('crypto');
const config = require('../../../utils/config');

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);

router.post('/', async (req, res) => {
    console.log("Req Body - customerLogin : ", req.body);

    try {
        //Reference - https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options

        const encrypt = crypto.createCipheriv(algorithm, key, iv);
        var hash = encrypt.update(req.body.password, 'utf8', 'hex');
        hash += encrypt.final('hex');

        const customer = await Customers.find({CustEmailId: req.body.emailID, CustPassword: hash});
        console.log(" customer details: ", customer);

        if(!customer || customer.length == 0){
            return res.status(404).send("Invalid Username or Password");
        }

        const restaurants = await Restaurants.find();
        console.log(" restaurants details: ", restaurants);

        const payload = {
            customer: customer,
            restaurants: restaurants
        }

        jwt.sign(payload, config.jwtSecret, {
            expiresIn: 1008000,
        }, (err, token) => {
            if (err) throw err;
            res.status(200).end( token );
        });
    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error");
    }

});
module.exports = router;