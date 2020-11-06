"use strict";
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../../utils/config');
const { auth } = require("../../../utils/passport");

var kafka = require('../../../kafka/client');

// auth();

// router.post('/', async (req, res) => {
//     console.log("Req Body - customerLogin : ", req.body);

//     try {
//         //Reference - https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options

//         const encrypt = crypto.createCipheriv(algorithm, key, iv);
//         var hash = encrypt.update(req.body.password, 'utf8', 'hex');
//         hash += encrypt.final('hex');

//         const customer = await Customers.find({CustEmailId: req.body.emailID, CustPassword: hash});
//         // console.log(" customer details: ", customer);

//         if(!customer || customer.length == 0){
//             return res.status(404).send("Invalid Username or Password");
//         }

//         const restaurants = await Restaurants.find();
//         // console.log(" restaurants details: ", restaurants);

//         const customerId = {
//             _id: customer[0]._id
//         } 
//         const payload = {
//             customer: customer,
//             restaurants: restaurants
//         }

//         jwt.sign(customerId, config.secret, {
//             expiresIn: 1008000,
//         }, (err, token) => {
//             if (err) throw err;
//             console.log("token: ", token);
//             console.log("payload: ", payload)
//             res.status(200).json( {token: token, payload: payload });
//         });
//     } catch (err) {
//         console.log("DB error: ", err.message);
//         res.status(500).send("DB Error");
//     }

// });


router.post('/', async (req, res) => {
    console.log("Req Body - customer Sign in : ", req.body);

    kafka.make_request('cus_signin', req.body, function(err,results){
   
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200){
            const id = {
                msg: results.value
            }
       
            jwt.sign(results.customerId, config.secret, {
                expiresIn: 1008000,
            }, (err, token) => {
                if (err) throw err;

                console.log("token: ", token);
                console.log("payload: ", payload)
                res.json({ token: token,  payload: results.payload});
            });
        }  
    })
});
module.exports = router;
