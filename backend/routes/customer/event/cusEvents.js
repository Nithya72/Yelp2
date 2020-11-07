"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

auth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Register for Events: ", req.body);

    kafka.make_request('register_events', req.body, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.eventMsg);
        }  
    })
});


router.get('/:id', checkAuth, async (req, res) => {
    console.log("get registered events:", req.params.id);

    kafka.make_request('get_registered_events', req.params.id, function(err,results){
   
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
