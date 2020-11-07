"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

auth();

router.get('/', checkAuth, async (req, res) => {
    console.log("Req Body - get all Events: ", req.body);

    kafka.make_request('get_all_events', req.body, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.events);
        }  
    })
});
module.exports = router;