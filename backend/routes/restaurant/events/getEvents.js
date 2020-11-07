"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, resAuth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

resAuth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Get Events: ", req.body);

    kafka.make_request('res_get_events', req.body, function(err,results){
   
        if (err){
            console.log("Inside err:", err);
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.events);
        }  
    })
});

module.exports = router;
