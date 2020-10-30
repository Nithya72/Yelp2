const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    CustName: {type: String},
    CustEmailId: {type: String},
    CustPassword: {type: String},
    CustomerPhoneNo: {type: String},
    CustPic: {type: String, default:'avatar.jpg'},    
    YelpingSince : {type: String},
    ThingsLove: {type: String, default:'You have not told us yet ... do tell!'},
    FindMeIn: {type: String},
    MyBlog: {type: String},
    CustomerDOB: {type: String},
    CustomerCity: {type: String},
    CustomerState: {type: String},
    CustomerCountry: {type: String},
    NickName: {type: String},
    Headline: {type: String},
    FriendsCount: { type: Number , default:0},
    ReviewsCount: { type: Number , default:0},
    PhotosCount: { type: Number , default:0},
});

const Customers = mongoose.model('customers', CustomerSchema);
module.exports = Customers;