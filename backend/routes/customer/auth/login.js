"use strict";
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../../utils/config');

var kafka = require('../../../kafka/client');

router.post('/', async (req, res) => {
    console.log("Req Body - customer Sign in : ", req.body);

    kafka.make_request('cus_signin', req.body, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200){
       
            jwt.sign(results.customerId, config.secret, {
                expiresIn: 1008000,
            }, (err, token) => {
                if (err) throw err;

                console.log("Backend token: ", token);
                console.log("Backend payload: ", results.payload)
                res.status(200).json({ token: token,  payload: results.payload});
            });
        }  
    })
});
module.exports = router;
