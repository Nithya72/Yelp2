
const express = require('express');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const router = express.Router();

const Customers = require('../../../models/Customers');

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);


router.post('/', async (req, res) => {
    console.log("Req Body - customerSignUp : ", req.body);

    try{

        const encrypt = crypto.createCipheriv(algorithm, key, iv);
        var hash = encrypt.update(req.body.password, 'utf8', 'hex');
        hash += encrypt.final('hex');


    let customer = new Customers({ CustName: req.body.userName, CustEmailId: req.body.emailID, CustPassword: req.body.password });
    await customer.save();
    res.status(200).send('You have successfully registered!');

    }catch(err){
        console.log("Error CustomerSignUp", err);
        res.status(500).send('Oops! We couldn\'t register you now. Try after sometime.');
    }
});
module.exports = router;

