"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, resAuth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

resAuth();

router.get('/:id', checkAuth, async (req, res) => {
    console.log("Req Body - Load Messages: ", req.params.id);

    kafka.make_request('res_load_message', req.params.id, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.messages);
        }  
    })
});

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Restaurant Send Messages: ", req.body);

    kafka.make_request('res_send_message', req.body, function(err,results){
   
        if (err){
            console.log("Inside err:", err);
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.messages);
        }  
    })
});

module.exports = router; 