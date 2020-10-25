const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Decimal128 } = require('mongodb');

const DishSchema = new mongoose.Schema({
    DishName: {type: String},
    DishPrice: {type: Decimal128},
    Cuisine: {type: String},
    DishImg: {type: String},
    DishMainIngd: {type: String},    
    DishCategory : {type: String},
    DishDescription: {type: String}
})
DishSchema.plugin(AutoIncrement, {inc_field: 'DishId'});

const Dishes = mongoose.model('dishes', DishSchema);
module.exports = Dishes;