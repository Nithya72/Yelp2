"use strict";
var JwtStrategy = require('passport-jwt').Strategy;
var { ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { secret } = require('../utils/config');
const Customers = require('../models/Customers');
const Restaurants = require('../models/Restaurants');

// Setup work and export for the JWT passport strategy
function customerAuth() {
    console.log("1a");

    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: secret
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            console.log("1b:",jwt_payload._id );
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

// Setup work and export for the JWT passport strategy
function restaurantAuth() {
    console.log("1a");
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };
    console.log("1b:");
    passport.use( new JwtStrategy(opts, (jwt_payload, callback) => {
            console.log("1c:");
            const customerId = jwt_payload._id;

            Restaurants.findById(customerId, (err, results) => {
                if (err) {
                    console.log("1d");
                    return callback(err, false);
                }
                if (results) {
                    console.log("1e");
                    callback(null, results);
                } else {
                    console.log("1f");
                    callback(null, false);
                }
            });
        })
    );
}

function checkAuth(req, res, next) {

    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(404).json({ msg: 'No Token, authorization denied' });
    }

    try {
        passport.authenticate('jwt', { session: false });
        const decoded = jwt.verify(token, secret);
        req.user = decoded.user;
        console.log('checkAuth', req.user);
        next();
    } catch (err) {
        res.status(404).json({ msg: ' Token is not valid' });
    }
}

exports.customerAuth = customerAuth;
//passport.authenticate("jwt", { session: false });
exports.checkAuth = passport.authenticate('jwt', { session: false });
exports.restaurantAuth = restaurantAuth;