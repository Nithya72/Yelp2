const mongoose = require('mongoose');
const config = require('../utils/config');
const database = "mongodb+srv://yelp:nursery@cluster0.wvz8o.mongodb.net/yelp?retryWrites=true&w=majority";

const connectDB = async() => {

try{
   await mongoose.connect( config.mongoURI, 
    {   
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        poolSize: 500,
        bufferMaxEntries: 0
    });
    console.log("Connected to MongoDB")
}
catch(err){
    console.log("Error connecting to DB: "+err);
    process.exit(1);
}
};

module.exports = connectDB;