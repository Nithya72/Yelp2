"use strict";
const express = require("express");
const Customers = require('../../../models/Customers');
const jwt = require('jsonwebtoken');
const router = express.Router();
var crypto = require('crypto');
const config = require('../../../utils/config');

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);


router.post('/', async (req, res) => {
    console.log("Req Body - customer Sign up : ", req.body);

    try {
        const encrypt = crypto.createCipheriv(algorithm, key, iv);
        var hash = encrypt.update(req.body.password, 'utf8', 'hex');
        hash += encrypt.final('hex');

        const customer = new Customers({ CustName: req.body.userName, CustEmailId: req.body.emailID, CustPassword: hash });
        await customer.save();

        console.log(" customer id: ", customer._id);

        const id = {
            customer: { id: customer._id},
            msg: "You have successfully registered!"
        }

        jwt.sign(id, config.secret, {
            expiresIn: 1008000,
        }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error");
    }

});
module.exports = router;