"use strict";
const express = require("express");
const Messages = require('../../../models/Messages');
const router = express.Router();
var app = express();
var http = require('http').Server(app);
const { checkAuth, resAuth } = require('../../../utils/passport');

resAuth();

router.post('/', checkAuth, async (req, res) => {
    console.log("Req Body - Initiaze Conversation : ", req.body);
    try {
        let restaurant = {"name": req.body.restName, "id":req.body.restId}
        let msgs = new Messages({ restName:  req.body.restName, restId: req.body.restId  });
   
        let customer = { name: req.body.custName, id: req.body.custId};
        msgs.customers.push(customer);

        var newMsg = await msgs.save();
        console.log("primary id: ", newMsg);


        var data = {sender : req.body.restName, message : req.body.message, msgTime: new Date(), title: req.body.title}
        const finalMsg = await Messages.findOneAndUpdate({ _id: newMsg._id, "customers.id" : req.body.custId}, { "$push": {"customers.$.messages": data }}, {new: true});
       
        console.log(" Final Message Details: ", finalMsg);

        res.status(200).send('Chat Initiated!');

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Add Event");
    }

});

module.exports = router;
