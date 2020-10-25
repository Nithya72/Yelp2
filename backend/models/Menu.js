const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const MenuSchema = new mongoose.Schema({
    DishId: {type: Number},
    RestaurantId: {type: Number}
})
MenuSchema.plugin(AutoIncrement, { inc_field: 'MenuId'});

const Menu = mongoose.model('menu', MenuSchema);
module.exports = Menu;