const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const EventSchema = new mongoose.Schema({
    Restaurant : { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants'},
    RegisteredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customers'}],
    EventName: {type: String},
    EventDay: {type: String, default:'Sunday'},
    EventDate: {type: Date},
    EventTime: {type: String},
    EventContactNo: {type: String},
    EventPlace: {type: String},    
    EventCity : {type: String},
    EventPrice: {type: String},
    EventDescription: {type: String},
    EventType: {type: String},
    EventWhatWhy: {type: String},
    EventLatitude: {type: String},
    EventLongitude: {type: String},
    EventHashtag: {type: String}
})
EventSchema.plugin(AutoIncrement, { inc_field: 'EventId'});
const Events = mongoose.model('events', EventSchema);
module.exports = Events;