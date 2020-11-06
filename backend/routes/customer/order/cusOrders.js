"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');

auth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Place Orders: ", req.body);

    kafka.make_request('place_cus_orders', req.body, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.orderMsg);
        }  
    })
});


router.get('/:id', checkAuth, async (req, res) => {
    console.log("Req Body - Get Orders: ", req.params.id);

    kafka.make_request('get_cus_orders', req.params.id, function(err,results){
   
        if (err){
            console.log("Inside err:", err);
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.orders);
        }  
    })
});
module.exports = router;