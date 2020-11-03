//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
const path = require("path");
const multer = require("multer");
var connectDB = require('./utils/database');
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: true, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

app.use(bodyParser.json());

// io.on('connection', () =>{ console.log('a user is connected') });

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

connectDB();


app.use(express.json({ extended: false }));

app.get('/', (req, res) => { res.send('API running'); });

app.use('/restaurant/signup', require('./routes/restaurant/auth/signup'));
app.use('/restaurant/login', require('./routes/restaurant/auth/login'));
app.use('/restaurant/menu', require('./routes/restaurant/menu/addUpdateMenu'));
app.use('/restaurant/profile', require('./routes/restaurant/profile/updateProfile'));
app.use('/restaurant/orders', require('./routes/restaurant/order/handleOrder'));
app.use('/restaurant/events', require('./routes/restaurant/events/getEvents'));
app.use('/restaurant/event/add', require('./routes/restaurant/events/addEvents'));
app.use('/restaurant/customer', require('./routes/restaurant/profile/customerProfile'));
app.use('/restaurant/message', require('./routes/restaurant/message/initMessage'));


app.use('/customer/signup', require('./routes/customer/auth/signup'));
app.use('/customer/login', require('./routes/customer/auth/login'));
app.use('/customer/search/restaurants', require('./routes/customer/landing/searchRestaurants'));
app.use('/customer/profile', require('./routes/customer/profile/updateProfile'));
app.use('/customer/orders', require('./routes/customer/order/cusOrders'));
app.use('/customer/events', require('./routes/customer/event/cusEvents'));
app.use('/customer/allevents', require('./routes/customer/event/allEvents'));
app.use('/customer/review', require('./routes/customer/review/postReview'));
app.use('/customer/message', require('./routes/customer/message/loadMessage'));


// //------------------------------------------------------------------------------------------------------------------------------------------------


// io.on('connection', (socket) => {
//     console.log(socket.id);

//     socket.on('SEND_MESSAGE', function(data){
//         io.emit('RECEIVE_MESSAGE', data);
//     })
// });

// //------------------------------------------------------------------------------------------------------------------------------------------------

// Reference from https://www.geeksforgeeks.org/file-uploading-in-node-js/?ref=lbp



// async function updateProfilePic(filename, id, table) {

//     var sql = null;
//     if (table == "Customers") {
//         sql = "UPDATE Customers SET CustPic = '" + filename + "' WHERE CustomerId = '" + id + "'";
//     }
//     else if (table == "Restaurants") {
//         sql = "UPDATE Restaurants SET ProfilePic = '" + filename + "' WHERE RestaurantId = '" + id + "'";
//     }
//     else if (table == "Dishes") {
//         sql = "UPDATE Dishes SET DishImg = '" + filename + "' WHERE DishId = '" + id + "'";
//     }

//     console.log("SQL - placeOrders: ", sql)

//     return new Promise(function (resolve, reject) {
//         con.query(sql, function (err, results) {
//             if (err) return reject(err);
//             return resolve(results);
//         });
//     });
// }



// //------------------------------------------------------------------------------------------------------------------------------------------------
// //------------------------------------------------------------------------------------------------------------------------------------------------




    //start your server on port 3001
    app.listen(3001);
    console.log("Server Listening on port 3001");


    //Order#2 Status