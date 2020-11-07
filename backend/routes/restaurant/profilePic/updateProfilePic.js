"use strict";
const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const { checkAuth, resAuth } = require('../../../utils/passport');
var kafka = require('../../../kafka/client');

resAuth();

//Reference from https://www.geeksforgeeks.org/file-uploading-in-node-js/?ref=lbp

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../frontend/src/images/profile_pics")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})

const maxSize = 1 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the " + "following filetypes - " + filetypes);
    }
}).single("profilePic");

router.post('/', checkAuth, async (req, res, next) => {
    upload(req, res, async (err) => {

        console.log("Inside Uploading Details:", req.body.profilePic, " : ", req.body.id);
        if (err) {
            console.log("Couldn't uploaded!: ", err);
            res.send("Failed")
        }
        else {

            var data = {};
            data.fileName = res.req.file.filename;
            data.id = req.body.id;

            console.log("Done! Res", data.fileName);

            kafka.make_request('res_profile_pic', data, function(err,results){   
                if (err){
                    console.log("Inside err:", err);
                    res.status(500).send("Kafka Error");
                } 
                else if (results.status == 200 || results.status == 404 ){
                    res.status(results.status).json(results.restaurant);
                }  
            })   

        }
    })
});
module.exports = router;