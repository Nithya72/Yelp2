const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrderSchema = new mongoose.Schema({
    OrderAmount: {type: Decimal128},
    OrderDate: {type: Date},
    // OrderTime: {type: Timestamp},
    RestaurantId: {type: Number},
    RestaurantName: {type: String},    
    CustomerId : {type: Number},
    OrderStatus: {type: String},
    DeliveryOption: {type: String}
})
OrderSchema.plugin(AutoIncrement, { inc_field: 'OrderId'});

const Orders = mongoose.model('orders', OrderSchema);
module.exports = Orders;