"use strict";
const express = require("express");
const Customers = require('../models/Customers');
var crypto = require('crypto');

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);


const handle_request = async (msg, callback) => {
    console.log("Req Body - customer Sign up : ", msg);
    var res = {};

    const encrypt = crypto.createCipheriv(algorithm, key, iv);
    var hash = encrypt.update(msg.password, 'utf8', 'hex');
    hash += encrypt.final('hex');

    const customer = new Customers({ CustName: msg.userName, CustEmailId: msg.emailID, CustPassword: hash });

    customer.save((error, data) => {
        if (error) {
            res.status = 401; res.response = error;
            callback(null, res);
        }
        else {
            res.status = 200; res.response = "You have successfully registered!";
            console.log("service - results: ", res);
            callback(null, res);
        }
    });
};


module.exports.handle_request = handle_request;