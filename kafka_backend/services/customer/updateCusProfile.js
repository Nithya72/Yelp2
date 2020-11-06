"use strict";
const Customers = require('../models/Customers');


const handle_request = async (msg, callback) => {
    console.log("Service - update customer profile : ", msg);
    var res = {};

    var data = { CustName: msg.CustName, NickName: msg.NickName, CustomerDOB: msg.CustomerDOB, CustEmailId: msg.CustEmailId, CustomerPhoneNo: msg.CustomerPhoneNo, CustomerCity:msg.CustomerCity, CustomerState: msg.CustomerState, CustomerCountry: msg.CustomerCountry, YelpingSince: msg.YelpingSince, ThingsLove: msg.ThingsLove,  FindMeIn: msg.FindMeIn, MyBlog: msg.MyBlog}

    const customer = await Customers.findOneAndUpdate({ _id: msg._id }, data, { new: true });
    console.log(" customer updated details: ", customer);

    if (!customer) {
        res.status = 404; res.customer = "Couldn't update try after sometime";
        callback(null, res);
    } else {
        res.status = 200; res.customer = customer;
        callback(null, res);
    }
};

module.exports.handle_request = handle_request;

 