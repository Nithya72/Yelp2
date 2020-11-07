"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, resAuth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

resAuth();

router.get('/:id', checkAuth, async (req, res) => {
    console.log("Req Body - Get Orders: ", req.params.id);

    kafka.make_request('res_get_orders', req.params.id, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.orders);
        }  
    })
});

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Update Orders Status: ", req.body);

    kafka.make_request('res_update_orders', req.body, function(err,results){
   
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
