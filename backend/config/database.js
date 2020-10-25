const mongoose = require('mongoose');
const config = require('config');
const database = "mongodb+srv://yelp:nursery@cluster0.wvz8o.mongodb.net/yelp?retryWrites=true&w=majority";

//config.get('mongoURI');

const connectDB = async() => {

try{
   await mongoose.connect(database, 
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true});
    console.log("Connected to MongoDB")
}
catch(err){
    console.log("Error connecting to DB: "+err);
    process.exit(1);
}
};

module.exports = connectDB;