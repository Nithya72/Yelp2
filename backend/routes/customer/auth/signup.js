"use strict";
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../../utils/config');

var kafka = require('../../../kafka/client');


// router.post('/', async (req, res) => {
//     console.log("Req Body - customer Sign up : ", req.body);

//     try {
//         const encrypt = crypto.createCipheriv(algorithm, key, iv);
//         var hash = encrypt.update(req.body.password, 'utf8', 'hex');
//         hash += encrypt.final('hex');

//         const customer = new Customers({ CustName: req.body.userName, CustEmailId: req.body.emailID, CustPassword: hash });
//         await customer.save();

//         console.log(" customer id: ", customer._id);

//         const id = {
//             customer: { id: customer._id},
//             msg: "You have successfully registered!"
//         }

//         jwt.sign(id, config.secret, {
//             expiresIn: 1008000,
//         }, (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//         });
//     } catch (err) {
//         console.log("DB error: ", err.message);
//         res.status(500).send("DB Error");
//     }

// });


router.post('/', async (req, res) => {
    console.log("Routes - req.body - Sign up : ", req.body);

    kafka.make_request('cus_signup', req.body, function(err,results){
        
        if (err){
            console.log("Inside err");
            res.status(500).send("Kafka Error");
        } 
        else if (results.status == 200){

            console.log("results: ", results);
            const id = {
                msg: results.response
            }
       
            jwt.sign(id, config.secret, {
                expiresIn: 1008000,
            }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        }  
    })
});

module.exports = router;