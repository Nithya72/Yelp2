"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');

var kafka = require('../../../kafka/client');
auth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Search Restaurants: ", req.body);

    kafka.make_request('search_restaurants', req.body, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404){
            res.status(results.status).send(results.restaurants);
        }  
    })
});
module.exports = router;
