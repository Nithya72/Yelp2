const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ReviewSchema = new mongoose.Schema({
    Rating: {type: Decimal128},
    Comment: {type: String},
    CustomerId: {type: Number},    
    CustomerName : {type: String},
    RestaurantId: {type: Number},
    ReviewDate: {type: Date}
})
ReviewSchema.plugin(AutoIncrement, { inc_field: 'ReviewId'});

const Reviews = mongoose.model('reviews', ReviewSchema);
module.exports = Reviews;