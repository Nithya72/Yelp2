"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth, resAuth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

resAuth();
router.get('/:id', checkAuth, async (req, res) => {
    console.log("Req Body - Customer Profile : ", req.params.id);

    kafka.make_request('res_get_customer', req.params.id, function(err,results){
   
        if (err){
            console.log("Inside err:", err);
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200 || results.status == 404 ){
            res.status(results.status).json(results.customer);
        }  
    })
});

module.exports = router;