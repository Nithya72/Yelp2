"use strict";
const express = require("express");
const Restaurants = require('../../../models/Restaurants');
const jwt = require('jsonwebtoken');
const router = express.Router();
var crypto = require('crypto');
const config = require('../../../utils/config');
const { restaurantAuth } = require('../../../utils/passport');

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);

restaurantAuth();

router.post('/', async (req, res) => {
    console.log("Req Body - restaurantLogin : ", req.body);

    try {
        //Reference - https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options
        
        const encrypt = crypto.createCipheriv(algorithm, key, iv);
        var hash = encrypt.update(req.body.restPassword, 'utf8', 'hex');
        hash += encrypt.final('hex');

        const restaurant = await Restaurants.find({RestEmailId: req.body.restEmailID, RestPassword: hash});
        console.log(" restaurant details: ", restaurant);

        if(!restaurant || restaurant.length == 0){
            return res.status(404).send("Invalid Username or Password");
        }

        // const payload = {
        //     restaurant: restaurant
        // }

        jwt.sign({restaurant}, config.jwtSecret, {
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