"use strict";
const express = require("express");
const Messages = require("../../../models/Messages");
const router = express.Router();
const { checkAuth, auth } = require('../../../utils/passport');

auth();

router.get('/:id', checkAuth, async (req, res) => {
    console.log("Req Body - Load Messages: ", req.params.id);

    kafka.make_request('cus_get_message', req.params.id, function(err,results){
   
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
    console.log("Req Body - Send Messages: ", req.body);

    kafka.make_request('cus_send_message', req.body, function(err,results){
   
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
