"use strict";
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../../utils/config');

var kafka = require('../../../kafka/client');

router.post('/', async (req, res) => {
    console.log("Routes - Customer - Sign up : ", req.body);

    kafka.make_request('cus_signup', req.body, function(err,results){
        
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200){

            console.log("results: ", results);
            const id = {
                msg: results.response
            }
       
            jwt.sign(id, config.secret, {
                expiresIn: 1008000,
            }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        }  
    })
});

module.exports = router;