"use strict";
const express = require("express");
const Messages = require("../../../models/Messages");
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');


router.get('/:id', async (req, res) => {

    console.log("Req Body - Load Messages: ", req.params.id);
    try {
        const messages = await Messages.find({ restId: req.params.id }).sort({ "customers.messages.msgTime" : 1 });
  
        console.log("Get messages - Restaurant: ", messages);

        res.status(200).json(messages);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Get Messages");
    }

});


router.post('/', async (req, res) => {

    console.log("Req Body - Restaurant Send Messages: ", req.body);
    try {
        var data = {sender : req.body.sender, message : req.body.message, msgTime: new Date()}
        const finalMsg = await Messages.findOneAndUpdate({ _id: req.body._id, "customers.id" : req.body.custId}, { "$push": {"customers.$.messages": data }}, {new: true});
       
        const messages = await Messages.find({  restId: req.body.restId  }).sort({ "customers.messages.msgTime" : 1 });

        console.log(" added new chat from customer: ", messages);

        res.status(200).json(messages);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Get Messages");
    }

});
module.exports = router; 