"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

auth();

router.get('/:id', checkAuth, async (req, res) => {
    console.log("Req Body - get yelp users : ", req.params.id);

    kafka.make_request('get_yelp_users', req.params.id, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.customers);
        }  
    })
});


router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - follow yelp users : ", req.body);

    kafka.make_request('follow_yelp_users', req.body, function(err,results){
   
        if (err){
            console.log("Inside err:", err);
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results);
        }  
    })
});

module.exports = router;


