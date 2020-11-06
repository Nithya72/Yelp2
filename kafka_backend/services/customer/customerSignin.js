"use strict";
const Customers = require('../models/Customers');
const Restaurants = require('../models/Restaurants');
var crypto = require('crypto');

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);


const handle_request = async (msg, callback) => {
    console.log("Req Body - customerLogin : ", msg);
    var res = {};
    //Reference - https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options

    const encrypt = crypto.createCipheriv(algorithm, key, iv);
    var hash = encrypt.update(msg.password, 'utf8', 'hex');
    hash += encrypt.final('hex');

    const customer = await Customers.find({ CustEmailId: msg.emailID, CustPassword: hash });
    // console.log("customer details: ", customer);

    if (!customer) {
        res.status = 404; res.response = "Invalid Username or Password";
        callback(null, res);
    } else {
        const restaurants = await Restaurants.find();

        const customerId = {
            _id: customer[0]._id
        }
        const payload = {
            customer: customer,
            restaurants: restaurants
        }

        res.status = 200; res.customerId = customerId; res.payload = payload;
        // console.log("service res: ", res);
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;