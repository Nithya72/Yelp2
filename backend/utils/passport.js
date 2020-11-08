"use strict";
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const { secret } = require('../utils/config');
const Customers = require('../../kafka_backend/models/Customers');
const Restaurants = require('../../kafka_backend/models/Restaurants');
const jwt = require('jsonwebtoken');


function auth() {

    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: secret
    };
    passport.use( 
        new JwtStrategy(opts, (jwt_payload, callback) => {
            const customerId = jwt_payload._id;

            Customers.findById(customerId, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    console.log("1c");
                    callback(null, results);
                } else {
                    callback(null, false);
                }
            });
        })
    );
}


function resAuth() {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };
    passport.use( new JwtStrategy(opts, (jwt_payload, callback) => {
            const restaurantId = jwt_payload._id;

            Restaurants.findById(restaurantId, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    callback(null, results);
                } else {
                    callback(null, false);
                }
            });
        })
    );
}

function checkAuth(req, res, next){
    const token = req.header('authorization');

    if (!token) {
        return res.status(401).json('Authorization denied');
    }

    try {
        passport.authenticate('jwt', { session: false });
        const decoded = jwt.verify(token, secret);
        console.log("decode: ",decoded);
        var user = decoded._id;

        next();
    } catch (err) {
        res.status(401).json(' Invalid token');
    }
}

exports.auth = auth;
exports.checkAuth = checkAuth;
exports.resAuth = resAuth;