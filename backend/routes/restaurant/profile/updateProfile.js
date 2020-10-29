"use strict";
const express = require("express");
const path = require("path");
const multer = require("multer");
const Restaurants = require('../../../models/Restaurants');
const router = express.Router();
const { checkAuth } = ('../../../utils/passport');

router.post('/', async (req, res) => {
    console.log("Req Body - update Restaurant : ", req.body);
    try {
        var data = { RestName: req.body.RestName, Location: req.body.Location, Description: req.body.Description, RestPhoneNo: req.body.RestPhoneNo, RestTimings: req.body.RestTimings }

        const restaurant = await Restaurants.findOneAndUpdate({ _id: req.body._id }, data, { new: true });
        console.log(" restaurant updated details: ", restaurant);

        res.status(200).json(restaurant);

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Update Restaurant");
    }

});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./frontend/src/images/profile_pics")
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


router.post('/pic', async (req, res) => {
    console.log("Req Body - Update Profile Pic : ", req.body);

    try {
        upload(req, res, function (err) {
            if (err) {
                console.log("Coulndt upload pic!: ", err);
                res.send("Failed")
            }
            else {
                var data = { ProfilePic: res.req.file.filename }

                const restaurant = Restaurants.findOneAndUpdate({ _id: req.body.id }, data, { new: true });
                console.log(" restaurant updated details: ", restaurant);

                res.status(200).json(restaurant);
            }
        })

    } catch (err) {
        console.log("DB error: ", err.message);
        res.status(500).send("DB Error - Update Restaurant");
    }
});
module.exports = router;