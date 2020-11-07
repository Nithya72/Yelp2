"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, resAuth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

resAuth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - update Restaurant Profile: ", req.body);

    kafka.make_request('res_update_profile', req.body, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.restaurant);
        }  
    })
});

module.exports = router;