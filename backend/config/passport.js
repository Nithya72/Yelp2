var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('./config');
const Customers = require('../models/Customers');


// Setup work and export for the JWT passport strategy
function customerAuth() {
    console.log("1a");

    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: config.secret
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            console.log("1b:",jwt_payload._id );
            const customerId = jwt_payload._id;

            Customers.findById(customerId, (err, result) => {
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
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.secret
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            const customerId = jwt_payload._id;

            Customers.findById(customerId, (err, result) => {
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

exports.customerAuth = customerAuth;
exports.checkAuth = passport.authenticate("jwt", { session: false });
exports.restaurantAuth = customerAuth;
// exports.restaurantCheckAuth = passport.authenticate("jwt", { session: false });