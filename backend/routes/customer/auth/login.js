const express = require('express');
var crypto = require('crypto');
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../../../config/config");

const Customers = require('../../../models/Customers');

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);

const {customerAuth, checkAuth} = require('../../../config/passport'); 

customerAuth();

//checkAuth
router.post('/', async (req, res) => {
    console.log("Req Body - CustomerLogin : ", req.body);

    try{

        const encrypt = crypto.createCipheriv(algorithm, key, iv);
        var hash = encrypt.update(req.body.password, 'utf8', 'hex');
        hash += encrypt.final('hex');


    let customer = await Customers.findOne({CustEmailId: req.body.emailID, CustPassword: req.body.password});
    console.log("2: ", customer);

    if(!customer){
        console.log("Invalid Username or Password");
        return res.status(404).send('Invalid Username or Password');
    }

    jwt.sign(customer.toJSON(), config.secret, {
        expiresIn: 1008000,
    }, (err, token) => {
        if (err) throw err;

        console.log("3");
        res.status(200).send(JSON.stringify(customer));
    });
    }catch(err){
        console.log("Error CustomerLogin", err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;
