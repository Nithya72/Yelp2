const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const RegistrationSchema = new mongoose.Schema({
    RegCustomerId: {type: Number},
    RegEventId: {type: Number}
})
RegistrationSchema.plugin(AutoIncrement, { inc_field: 'RegistrationId'});

const Registration = mongoose.model('registration', RegistrationSchema);
module.exports = Registration;