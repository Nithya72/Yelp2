"use strict";
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../../utils/config');

var kafka = require('../../../kafka/client');

router.post('/', async (req, res) => {
    console.log("Req Body - restaurant Sign in : ", req.body);

    kafka.make_request('res_signin', req.body, function (err, results) {

        if (err) {
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        }
        else if (results.status == 200) {

            jwt.sign(results.response, config.secret, {
                expiresIn: 1008000,
            }, (err, token) => {
                if (err) throw err;

                res.status(200).json(token);
            });
        }
    })
});
module.exports = router;
