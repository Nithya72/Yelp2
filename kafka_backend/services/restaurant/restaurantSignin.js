"use strict";
const Customers = require('../../models/Customers');
const Restaurants = require('../../models/Restaurants');
var crypto = require('crypto');

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);


const handle_request = async (msg, callback) => {
    console.log("Req Body - restaurantLogin : ", msg);
    var res = {};
    //Reference - https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options

    const encrypt = crypto.createCipheriv(algorithm, key, iv);
    var hash = encrypt.update(msg.restPassword, 'utf8', 'hex');
    hash += encrypt.final('hex');

    const restaurant = await Restaurants.find({RestEmailId: msg.restEmailID, RestPassword: hash});
    // console.log(" restaurant details: ", restaurant);

    if (!restaurant) {
        res.status = 404; res.response = "Invalid Username or Password";
        callback(null, res);
    } else {
        const response = {
            _id: restaurant[0]._id,
            restaurant: restaurant
        }       
        res.status = 200; res.response = response;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;