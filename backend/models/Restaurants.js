const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Decimal128 } = require('mongodb');

const RestaurantSchema = new mongoose.Schema({
    RestName: {type: String},
    RestEmailId: {type: String},
    RestPassword: {type: String},
    RestPhoneNo: {type: String},
    Location: {type: String},    
    RestTimings : {type: String},
    Cuisine: {type: String},
    Description: {type: String},
    Rating: {type: Decimal128, default:5.0},
    NumOfReviews: {type: Number},
    Review1: {type: String},
    Review2: {type: String},
    Review3: {type: String},
    IsCurbPickUp: {type: String},
    IsDineIn: {type: String},
    IsYelpDelivery: {type: String},
    Latitude: {type: String},
    Longitude: {type: String},
    ImageSrc: {type: String, default:'default.jpg'},
    ProfilePic: {type: String, default:'avatar.jpg'}
})
RestaurantSchema.plugin(AutoIncrement, {inc_field: 'RestaurantId'});

const Restaurants = mongoose.model('restaurants', RestaurantSchema);
module.exports = Restaurants;