const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    Restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants' },
    Customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customers' },
    OrderAmount: {type: Number},
    OrderTime: {type: Date},
    OrderDishes: {type: Array},
    OrderStatus: {type: String},
    DeliveryOption: {type: String}
})

const Orders = mongoose.model('orders', OrderSchema);
module.exports = Orders;