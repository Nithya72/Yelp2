//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var mysql = require('mysql');
var crypto = require('crypto');
const path = require("path")
const multer = require("multer")

//Algorithm for encrypting passwords
const algorithm = 'aes-192-cbc';
const pwd = 'privateKey';
const key = crypto.scryptSync(pwd, 'salt', 24);
const iv = Buffer.alloc(16, 0);


//Creating DB connection
var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "nursery",
//     database: "yelp"
// });


var con = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "nursery",
        database: "yelp"
    });

    exports.pool = con;

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

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

async function insertIntoDb(userName, emailID, password) {

    //Reference - https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options

    const encrypt = crypto.createCipheriv(algorithm, key, iv);
    var hash = encrypt.update(password, 'utf8', 'hex');
    hash += encrypt.final('hex');

    var sql = "INSERT INTO Customers (CustName, CustEmailId, CustPassword) VALUES ('" + userName + "','" + emailID + "','" + hash + "')";
    var db_result = await con.query(sql, function (err, result) {
        if (err) return err;

        console.log("Customer record inserted!", result);
        return result;
    });

    // console.log("The result is: ", db_result);
    return db_result;
}

app.post('/customerSignUp', function (req, res) {
    console.log("Req Body - customerSignUp : ", req.body);

    insertIntoDb(req.body.userName, req.body.emailID, req.body.password)
        .then(result => {
            if (result) {
                console.log("Success!")
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                var msg = "You have successfully registered!";
                res.end(msg);
            }
        }).catch(error => {
            console.log("CustomerSignUp - Index DB Error")
        });
});

async function fetchCustomers(emailID, password) {

    const encrypt = crypto.createCipheriv(algorithm, key, iv);
    var hash = encrypt.update(password, 'utf8', 'hex');
    hash += encrypt.final('hex');

    var sql = "SELECT * FROM Customers WHERE CustEmailId = '" + emailID + "' AND CustPassword = '" + hash + "'";
    console.log("Login SQL:", sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/customerLogin', function (req, res) {
    console.log("Req Body - customerLogin: ", req.body);

    fetchCustomers(req.body.emailID, req.body.password)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(202, {
                    'Content-Type': 'application/json'
                });
                res.end("Invalid Username or Password");
            } else {
                console.log("Success!");

                res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                // var msg = "Login Successful";
                res.end(JSON.stringify(result[0]));
            }
        }).catch(error => {
            console.log("CustomerLogin - Index DB Error")
        });
});

async function fetchByNeighborhoods(locations) {

    console.log("Locations: ", locations)

    var sql = "SELECT * FROM Restaurants WHERE Location IN (?)";

    return new Promise(function (resolve, reject) {
        con.query(sql, [locations], function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


app.post('/neighborhoods', function (req, res) {
    console.log("Req Body - neighborhoods : ", req.body);


    fetchByNeighborhoods(req.body)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(202, {
                    'Content-Type': 'application/json'
                });
                var msg = "Empty List";
                res.end(msg);
            } else {
                console.log("Success!", result);
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        })
        .catch(error => {
            console.log("fetchByNeighborhoods - Index DB Error: ", error)
        });
});


async function fetchByDeliveryOptions(deliveryOptions) {

    console.log("DeliveryOptions: ", deliveryOptions)

    var whereClause = [];

    deliveryOptions.forEach(option => {

        if (option == "Curbside PickUp") {
            whereClause.push("IsCurbPickUp='Y'");
        }

        if (option == "Dine In") {
            whereClause.push("IsDineIn='Y'");
        }

        if (option == "Yelp Delivery") {
            whereClause.push("IsYelpDelivery='Y'");
        }
    });

    console.log("WHERE CLAUSE - ", whereClause);

    var whereClauseString;
    if (deliveryOptions.length > 1) {
        whereClauseString = whereClause.join(" OR ");
    } else {
        whereClauseString = whereClause[0];
    }

    console.log("WHERE CLAUSE STRING - ", whereClauseString);


    var sql = "SELECT * FROM Restaurants WHERE " + whereClauseString;

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


app.post('/deliveryOptions', function (req, res) {
    console.log("Req Body - deliveryOptions : ", req.body);

    fetchByDeliveryOptions(req.body)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(202, {
                    'Content-Type': 'application/json'
                });
                var msg = "Empty List";
                res.end(msg);
            } else {
                console.log("Success!", result);
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        })
        .catch(error => {
            console.log("fetchByDeliveryOptions - Index DB Error: ", error)
        });
});


async function fetchRestaurants() {

    var sql = "SELECT * FROM Restaurants";

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.get('/custLanding', function (req, res) {
    console.log("Inside custLanding: ", req.body);

    fetchRestaurants()
        .then(result => {
            if (result) {

                if (result === undefined || result.length === 0) {
                    console.log("Empty List!", result);
                    res.writeHead(202, {
                        'Content-Type': 'application/json'
                    });
                    var msg = "Empty List";
                    res.end(msg);
                } else {
                    console.log("Success!");
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(result));
                }
            }
        }).catch(error => {
            console.log("CustLanding - Index DB Error")
        });

})

async function updateCustomerProfile(customer) {
    console.log(" updateCustomerProfile: ", customer)

    var sql = "UPDATE Customers SET CustName = '" + customer.CustName + "' ,  NickName = '" + customer.NickName + "' , CustomerDOB = '" + customer.CustomerDOB + "', CustEmailId = '" + customer.CustEmailId + "', CustomerPhoneNo = '" + customer.CustomerPhoneNo + "' ,  CustomerCity = '" + customer.CustomerCity + "' , CustomerState = '" + customer.CustomerState + "', CustomerCountry = '" + customer.CustomerCountry + "', YelpingSince = '" + customer.YelpingSince + "' , ThingsLove = '" + customer.ThingsLove + "', FindMeIn = '" + customer.FindMeIn + "', MyBlog = '" + customer.MyBlog + "' WHERE CustomerId = '" + customer.CustomerId + "'";
    console.log("updateCustomerProfile:", sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });

    // console.log(" updateRestaurantProfile ", restaurant)
}

async function fetchCustomerById(customerId) {

    var sql = "select * from Customers where CustomerId = '" + customerId + "'";

    console.log(" fetchCustomerById: ", sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


app.post('/updateCustomerProfile', function (req, res) {
    console.log("Req Body - updateCustomerProfile: ", req.body);

    updateCustomerProfile(req.body)
        .then(result => {
            if (result) {

                if (result === undefined || result.length === 0) {
                    console.log("Empty List!", result);
                    res.writeHead(401, {
                        'Content-Type': 'application/json'
                    });
                    res.end("Failed to Update Details");
                } else {
                    console.log("Success!", result);

                    fetchCustomerById(req.body.CustomerId)
                        .then(result => {
                            if (result) {

                                if (result === undefined || result.length === 0) {
                                    console.log("Empty List!", result);
                                    res.writeHead(401, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end("Failed to Update Details");
                                } else {
                                    console.log("Success!", result);

                                    res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                                    res.writeHead(200, {
                                        'Content-Type': 'application/json'
                                    });
                                    // var msg = "Login Successful";
                                    res.end(JSON.stringify(result));
                                }
                            }
                        }).catch(error => {
                            console.log("FetchCustomerById - Index DB Error")
                        });
                }
            }
        }).catch(error => {
            console.log("FetchCustomerById - Index DB Error")
        });
});

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

async function insertRestaurantIntoDb(restName, restEmailID, restPassword, restLocation) {

    //Reference - https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options

    const encrypt = crypto.createCipheriv(algorithm, key, iv);
    var hash = encrypt.update(restPassword, 'utf8', 'hex');
    hash += encrypt.final('hex');

    var sql = "INSERT INTO Restaurants (RestName, RestEmailId, RestPassword, Location) VALUES ('" + restName + "','" + restEmailID + "','" + hash + "','" + restLocation + "')";

    console.log("The sql for rest sign up: ", sql)

    var db_result = await con.query(sql, function (err, result) {
        if (err) return err;

        console.log("Restaurant record inserted!", result);
        return result;
    });

    // console.log("The result is: ", db_result);
    return db_result;
}


app.post('/restaurantSignUp', function (req, res) {
    console.log("Req Body - restaurantSignUp : ", req.body);

    insertRestaurantIntoDb(req.body.restName, req.body.restEmailID, req.body.restPassword, req.body.restLocation)
        .then(result => {
            if (result) {
                console.log("Success!")
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                var msg = "You have successfully registered!";
                res.end(msg);
            }
        }).catch(error => {
            console.log("RestaurantSignUp - Index DB Error")
        });
});


async function fetchRestaurantForLogin(restEmailID, restPassword) {

    const encrypt = crypto.createCipheriv(algorithm, key, iv);
    var hash = encrypt.update(restPassword, 'utf8', 'hex');
    hash += encrypt.final('hex');

    var sql = "SELECT * FROM Restaurants WHERE RestEmailId = '" + restEmailID + "' AND RestPassword = '" + hash + "'";
    console.log("Login SQL:", sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {

            if (err) return reject("DB Error");

            if (results.length == 0) return reject("Invalid Username or Password");

            return resolve(results);
        });
    });
}


app.post('/restaurantLogin', function (req, res) {
    console.log("Req Body - RestaurantLogin: ", req.body);

    fetchRestaurantForLogin(req.body.restEmailID, req.body.restPassword)
        .then(result => {
            if (result) {

                if (result === undefined || result.length === 0) {
                    console.log("Empty List!", result);
                    res.writeHead(401, {
                        'Content-Type': 'application/json'
                    });
                    res.end("Invalid Username or Password");
                } else {
                    console.log("Success!", result);

                    res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    // var msg = "Login Successful";
                    res.end(JSON.stringify(result));
                }
            }
        }).catch(error => {
            console.log("RestaurantLogin Catch -", error);
            res.writeHead(402, {
                'Content-Type': 'application/json'
            });
            res.end(error);
        });
});

async function updateRestaurantProfile(restaurant) {
    console.log(" Async function: ", restaurant)

    var sql = "UPDATE Restaurants SET RestName = '" + restaurant.RestName + "' ,  Location = '" + restaurant.Location + "' , Description = '" + restaurant.Description + "', RestPhoneNo = '" + restaurant.RestPhoneNo + "', RestTimings = '" + restaurant.RestTimings + "' WHERE RestaurantId = '" + restaurant.RestaurantId + "'";
    console.log("Login SQL:", sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });

    // console.log(" updateRestaurantProfile ", restaurant)
}

async function fetchRestaurantById(restaurantId) {

    var sql = "select * from Restaurants as r left join Menu as m on r. RestaurantId = m.RestaurantId left join Dishes as d on d.DishId = m.DishId where r.RestaurantId = '" + restaurantId + "'";

    console.log(" fetchRestaurantById: ", sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


app.post('/updateRestaurantProfile', function (req, res) {
    console.log("Req Body - RestaurantLogin: ", req.body.restaurant);

    updateRestaurantProfile(req.body.restaurant)
        .then(result => {
            if (result) {

                if (result === undefined || result.length === 0) {
                    console.log("Empty List!", result);
                    res.writeHead(401, {
                        'Content-Type': 'application/json'
                    });
                    res.end("Failed to Update Details");
                } else {
                    console.log("Success!", result);

                    fetchRestaurantById(req.body.restaurant.RestaurantId)
                        .then(result => {
                            if (result) {

                                if (result === undefined || result.length === 0) {
                                    console.log("Empty List!", result);
                                    res.writeHead(401, {
                                        'Content-Type': 'application/json'
                                    });
                                    res.end("Failed to Update Details");
                                } else {
                                    console.log("Success!", result);

                                    res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                                    res.writeHead(200, {
                                        'Content-Type': 'application/json'
                                    });
                                    // var msg = "Login Successful";
                                    res.end(JSON.stringify(result));

                                }
                            }
                        }).catch(error => {
                            console.log("RestaurantLogin - Index DB Error")
                        });

                }
            }
        }).catch(error => {
            console.log("RestaurantLogin - Index DB Error")
        });
});


async function searchRestaurants(searchName, searchLocation) {

    // var sql = "select * from Events where EventId in (select Distinct RegEventId from Registration where RegCustomerId = " + CustomerId + ");";

    var sql = "select  distinct r.RestaurantId, r.RestName, r.Cuisine, r.Description, r.ImageSrc, r.IsCurbPickUp, r.IsDineIn, r.IsYelpDelivery, r.Latitude, r.Longitude, r.Location, r.NumOfReviews, r.ProfilePic, r.Rating, r.RestPassword, r.RestPhoneNo, r.RestTimings, r.RestaurantId, r.Review1, r.Review2, r.Review3 from Restaurants as r join menu as m on r.RestaurantId = m.RestaurantId join Dishes as d on d.DishId = m.dishId where (d.DishName LIKE '%" + searchName + "%' or d.cuisine LIKE '%" + searchName + "%') and r.location like '%" + searchLocation + "%' ;"

    console.log("getRegisteredEventDetails SQL:" + sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/searchRestaurants', function (req, res) {
    console.log("Req Body - searchRestaurants : ", req.body);

    searchRestaurants(req.body.searchName, req.body.searchLocation)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(404, {
                    'Content-Type': 'application/json'
                });
                var msg = "No Search Result Found";
                res.end(msg);
            } else {
                console.log("Success!", result);
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        }).catch(error => {
            console.log("searchRestaurants - Index DB Error")
        });
});

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

async function fetchEvents(id, user) {

    var sql = "";

    if (user == "customer") {
        sql = "SELECT * FROM Events";
    }
    else {
        // sql = "SELECT * FROM Events where EventRestId = '"+ id +"'";
        sql = "select * from Events where EventRestId = '" + id + "'";
    }

    // console.log("fetchEvents SQL:", sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/getEvents', function (req, res) {
    console.log("Inside getEvents: ", req.body);

    fetchEvents(req.body.id, req.body.user)
        .then(result => {
            if (result) {

                if (result === undefined || result.length === 0) {
                    console.log("Empty List!", result);
                    res.writeHead(202, {
                        'Content-Type': 'application/json'
                    });
                    var msg = "Empty List";
                    res.end(msg);
                } else {
                    console.log("Success!");
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(result));
                }
            }
        }).catch(error => {
            console.log("GetEvents - Index DB Error")
        });

})


async function searchEvents(eventName) {

    var sql = "select * from Events where EventName Like '%" + eventName + "%'";
    console.log("Login SQL:", sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/searchEvents', function (req, res) {
    console.log("Req Body - searchEvents: ", req.body.eventName);

    searchEvents(req.body.eventName)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(202, {
                    'Content-Type': 'application/json'
                });
                res.end("No Events Found!");
            } else {
                console.log("Success!");

                res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                // var msg = "Login Successful";
                res.end(JSON.stringify(result));
            }
        }).catch(error => {
            console.log("searchEvents - Index DB Error")
        });
});



async function registerToEvent(CustomerId, EventId) {

    var sql = "INSERT INTO Registration (RegCustomerId, RegEventId) VALUES ('" + CustomerId + "','" + EventId + "')";

    console.log("SQL registerToEvent:", sql)

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);

            console.log("results insert registration: ", results);
            return resolve(results);
        });
    });
}


app.post('/registerToEvents', function (req, res) {
    console.log("Req Body - registerToEvents : ", req.body);

    registerToEvent(req.body.RegCustomerId, req.body.RegEventId)
        .then(result => {
            if (result) {
                console.log("Success!")
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                var msg = "You have successfully registered!";
                res.end(msg);
            }
        }).catch(error => {
            console.log("registerToEvents - Index DB Error")
        });
});

async function getRegisteredEventDetails(CustomerId) {

    var sql = "select * from Events where EventId in (select Distinct RegEventId from Registration where RegCustomerId = " + CustomerId + ");";

    // console.log("getRegisteredEventDetails SQL:" + sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/getRegisteredEvents', function (req, res) {
    console.log("Req Body - getRegisteredEvents : ", req.body.customerId);

    getRegisteredEventDetails(req.body.customerId)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(404, {
                    'Content-Type': 'application/json'
                });
                var msg = "We don't have any recent activity for you right now.";
                res.end(msg);
            } else {
                console.log("Success!");
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        }).catch(error => {
            console.log("getRegisteredEvents - Index DB Error")
        });
});


async function getRegisteredUsers(id) {

    var sql = "select * from customers where customerId in (select RegCustomerid from Registration where RegEventid = " + id + ");";

    console.log("getRegisteredEventDetails SQL:" + sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/getRegisteredUsers', function (req, res) {
    console.log("Req Body - getRegisteredEvents : ", req.body.id);

    getRegisteredUsers(req.body.id)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(404, {
                    'Content-Type': 'application/json'
                });
                var msg = "No participants are registered yet!";
                res.end(msg);
            } else {
                console.log("Success!", result);
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        }).catch(error => {
            console.log("getRegisteredEvents - Index DB Error")
        });
});



async function postEvents(eventRestId, eventName, eventDescription, eventTime, eventDate, eventLocation, eventHashtag, eventContactNo, eventType) {

    var sql = "INSERT INTO Events (EventRestId, EventName, EventDescription, EventTime, EventDate, EventPlace, EventHashtag, EventContactNo, EventType) Value ('" + eventRestId + "', '" + eventName + "', '" + eventDescription + "', '" + eventTime + "', '" + eventDate + "', '" + eventLocation + "', '" + eventHashtag + "', '" + eventContactNo + "', '" + eventType + "')";

    console.log("SQL registerToEvent:", sql)

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);

            console.log("results insert registration: ", results);
            return resolve(results);
        });
    });
}


app.post('/postEvents', function (req, res) {
    console.log("Req Body - registerToEvents : ", req.body);

    postEvents(req.body.eventDetails.eventRestId, req.body.eventDetails.eventName, req.body.eventDetails.eventDescription, req.body.eventDetails.eventTime, req.body.eventDetails.eventDate, req.body.eventDetails.eventLocation, req.body.eventDetails.eventHashtag, req.body.eventDetails.eventContactNo, req.body.eventDetails.eventType)
        .then(result => {
            if (result) {
                console.log("Success!")
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                var msg = "You have successfully registered!";
                res.end(msg);
            }
        }).catch(error => {
            console.log("registerToEvents - Index DB Error")
        });
});

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------


async function getRestaurantMenu(restaurantId) {

    var sql = "select DishId, DishName,  DishId as value, DishPrice, DishMainIngd, DishCategory, DishDescription, Cuisine, DishImg from Dishes where DishId in (select DishId from Menu where RestaurantId = " + restaurantId + ");";

    // console.log("getRestaurantMenu SQL:" + sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/getMenu', function (req, res) {
    console.log("Req Body - getMenu : ", req.body.restaurantId);

    getRestaurantMenu(req.body.restaurantId)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(404, {
                    'Content-Type': 'application/json'
                });
                var msg = "No Menu Yet!";
                res.end(msg);
            } else {
                console.log("Success!");
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        }).catch(error => {
            console.log("getMenu - Index DB Error")
        });
});

async function placeOrders(orderAmount, orders, restaurantId, customer, restaurantName, deliveryOption, orderStatus) {

    var sql = "INSERT INTO Orders (OrderAmount, OrderDate, RestaurantId, RestaurantName, CustomerId, OrderStatus, DeliveryOption, OrderDishes, OrderTime) VALUES ('" + orderAmount + "', CURDATE(), '" + restaurantId + "','" + restaurantName + "','" + customer + "','" + orderStatus + "','" + deliveryOption + "','" + orders + "', CURTIME())";
    console.log("SQL - placeOrders: ", sql)

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


app.post('/placeOrders', function (req, res) {
    console.log("Req Body - placeOrders : ", req.body);

    placeOrders(req.body.orderAmount, req.body.orders, req.body.restaurantId, req.body.customer, req.body.restaurantName, req.body.deliveryOption, req.body.orderStatus)
        .then(result => {
            if (result) {
                console.log("Success!")
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                var msg = "You have successfully Placed Order!";
                res.end(msg);
            }
        }).catch(error => {
            console.log("Sorry, couldn't place order now!")
        });
});

async function getOrderDetails(id, type) {

    var sql = "";

    if (type == "customer") {
        sql = "select * from Orders where CustomerId = " + id + " order by OrderTime desc;";
        sql = "select o.OrderId, o.OrderAmount, o.OrderDate, o.OrderDishes, o.OrderTime, o.RestaurantId, o.RestaurantName, o.CustomerId, o.OrderStatus, o.DeliveryOption, r.ProfilePic from Orders as o Join Restaurants as r on o.RestaurantId = r.RestaurantId where CustomerId = " + id + " order by OrderTime desc";
    } else {
        // sql = "select * from Orders where RestaurantId = "+ id + " order by OrderTime desc;";
        sql = "select * from Orders Join Customers on Orders.CustomerId = Customers.CustomerId where RestaurantId = " + id + " order by OrderTime desc;";
    }

    // console.log("getOrderDetails SQL:" + sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/getOrders', function (req, res) {
    console.log("Req Body - getOrders : ", req.body);

    getOrderDetails(req.body.id, req.body.type)
        .then(result => {
            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(404, {
                    'Content-Type': 'application/json'
                });
                var msg = "No Orders Yet!";
                res.end(msg);
            } else {
                console.log("Success!");
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(result));
            }
        }).catch(error => {
            console.log("getOrders - Index DB Error")
        });
});


async function updateOrders(orderId, status) {

    var sql = "update Orders set OrderStatus = '" + status + "' where OrderId = '" + orderId + "'";
    console.log("SQL - placeOrders: ", sql)

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


app.post('/updateOrders', function (req, res) {
    console.log("Req Body - updateOrders : ", req.body);

    updateOrders(req.body.orderId, req.body.status)
        .then(result => {

            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(401, {
                    'Content-Type': 'application/json'
                });
                res.end("Failed to Update Details");
            } else {
                console.log("Success!", result);

                getOrderDetails(req.body.id, req.body.type)
                    .then(result => {
                        if (result) {

                            if (result === undefined || result.length === 0) {
                                console.log("Empty List!", result);
                                res.writeHead(401, {
                                    'Content-Type': 'application/json'
                                });
                                res.end("Failed to Update Details");
                            } else {
                                console.log("Success!", result);

                                res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                });
                                // var msg = "Login Successful";
                                res.end(JSON.stringify(result));
                            }
                        }
                    }).catch(error => {
                        console.log("RestaurantLogin - Index DB Error")
                    });
            }
        }).catch(error => {
            console.log("Sorry, couldn't place order now!")
        });
});



async function updateMenu(dish) {

    var sql = "UPDATE Dishes SET DishName = '" + dish.DishName + "' ,  DishPrice = '" + dish.DishPrice + "' , Cuisine = '" + dish.Cuisine + "', DishMainIngd = '" + dish.DishMainIngd + "', DishCategory = '" + dish.DishCategory + "', DishDescription = '" + dish.DishDescription + "' WHERE DishId = '" + dish.DishId + "'";

    console.log("SQL - placeOrders: ", sql)

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


app.post('/updateMenu', function (req, res) {
    console.log("Req Body - updateMenu : ", req.body);

    updateMenu(req.body)
        .then(result => {

            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(401, {
                    'Content-Type': 'application/json'
                });
                res.end("Failed to Update Menu");
            } else {

                console.log("Success!", result);

                res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                var msg = "Sucessfully Updated";
                res.end(msg);

            }
        }).catch(error => {
            console.log("updateMenu - Index DB Error")
        });
});


async function addMenu(dish) {

    var sql = "INSERT INTO Dishes (DishName, DishPrice, Cuisine, DishMainIngd, DishCategory, DishDescription) VALUE ('" + dish.DishName + "', '" + dish.DishPrice + "', '" + dish.Cuisine + "', '" + dish.DishMainIngd + "', '" + dish.DishCategory + "', '" + dish.DishDescription + "')";
    console.log("SQL - placeOrders: ", sql)

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


async function getDishDetails(dish) {

    var sql = "select DishId from Dishes where DishName = '" + dish.DishName + "';";

    console.log("getDishDetails SQL:" + sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


async function addDishIntoMenu(restaurantId, dishId) {

    var sql = "select DishId, DishName,  DishId as value, DishPrice, DishMainIngd, DishCategory, DishDescription, Cuisine from Dishes where DishId in (select DishId from Menu where RestaurantId = " + restaurantId + ");";
    var sql = "INSERT INTO Menu ( DishId, RestaurantId) VALUES ('" + dishId + "', '" + restaurantId + "')";

    console.log("addDishIntoMenu SQL:" + sql);

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results, fields) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/addMenu', function (req, res) {
    console.log("Req Body - addMenu : ", req.body);

    addMenu(req.body.dish)
        .then(result => {

            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(401, {
                    'Content-Type': 'application/json'
                });
                res.end("Failed to Update Menu");
            } else {
                getDishDetails(req.body.dish)
                    .then(result => {
                        if (result) {

                            if (result === undefined || result.length === 0) {
                                console.log("Empty List!", result);
                                res.writeHead(401, {
                                    'Content-Type': 'application/json'
                                });
                                res.end("Failed to Update Menu");
                            } else {
                                console.log("Success getDishDetails!", result[0].DishId);

                                addDishIntoMenu(req.body.restaurantId, result[0].DishId)
                                    .then(result => {
                                        if (result) {

                                            if (result === undefined || result.length === 0) {
                                                console.log("Empty List!", result);
                                                res.writeHead(401, {
                                                    'Content-Type': 'application/json'
                                                });
                                                res.end("Failed to Update Details");
                                            } else {
                                                console.log("Success!", result);

                                                res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                                                res.writeHead(200, {
                                                    'Content-Type': 'application/json'
                                                });
                                                var msg = "Successfully Added Dishes Into Menu";
                                                res.end(JSON.stringify(result));
                                            }
                                        }
                                    }).catch(error => {
                                        console.log("addDishIntoMenu - Index DB Error")
                                    });
                            }
                        }
                    })
            }
        }).catch(error => {
            console.log("addMenu - Index DB Error")
        });
});


//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

//Reference from https://www.geeksforgeeks.org/file-uploading-in-node-js/?ref=lbp

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./frontend/src/images/profile_pics")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }
})

const maxSize = 1 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the " + "following filetypes - " + filetypes);
    }
}).single("profilePic");

async function updateProfilePic(filename, id, table) {

    var sql = null;
    if (table == "Customers") {
        sql = "UPDATE Customers SET CustPic = '" + filename + "' WHERE CustomerId = '" + id + "'";
    }
    else if (table == "Restaurants") {
        sql = "UPDATE Restaurants SET ProfilePic = '" + filename + "' WHERE RestaurantId = '" + id + "'";
    }
    else if (table == "Dishes") {
        sql = "UPDATE Dishes SET DishImg = '" + filename + "' WHERE DishId = '" + id + "'";
    }

    console.log("SQL - placeOrders: ", sql)

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}

app.post('/uploadProfilePic', (req, res, next) => {

    upload(req, res, function (err) {

        console.log("Inside Uploading Details:", req.body.custPic, " : ", req.body.id, " : ", req.body.table);
        if (err) {
            console.log("Coulndt uploaded!: ", err);
            res.send("Failed")
        }
        else {
            console.log("Done! Res", res.req.file.filename);

            updateProfilePic(res.req.file.filename, req.body.id, req.body.table)
                .then(result => {
                    if (result) {

                        if (result === undefined || result.length === 0) {
                            res.writeHead(401, {
                                'Content-Type': 'application/json'
                            });
                            res.end("Couldn't upload pic");
                        } else {
                            console.log("Success!", result);

                            res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                            res.writeHead(200, {
                                'Content-Type': 'application/json'
                            });
                            res.end(res.req.file.filename);
                        }
                    }
                }).catch(error => {
                    console.log("updateProfilePic - Index DB Error")
                });
        }
    })
})

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------


async function postReviews(review, restaurantId, column) {

    if (column == null) {
        column = "Review3";
    }

    var sql = "UPDATE Restaurants SET " + column + " = '" + review + "' WHERE RestaurantId = '" + restaurantId + "'";

    console.log("SQL - postReviews: ", sql)

    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, results) {
            if (err) return reject(err);
            return resolve(results);
        });
    });
}


app.post('/postReviews', function (req, res) {
    console.log("Req Body - postReviews : ", req.body);

    postReviews(req.body.review, req.body.RestaurantId, req.body.column)
        .then(result => {

            if (result === undefined || result.length === 0) {
                console.log("Empty List!", result);
                res.writeHead(401, {
                    'Content-Type': 'application/json'
                });
                res.end("Failed to Update Reviews");
            } else {

                fetchRestaurantById(req.body.RestaurantId)
                    .then(result => {
                        if (result) {

                            if (result === undefined || result.length === 0) {
                                console.log("Empty List!", result);
                                res.writeHead(401, {
                                    'Content-Type': 'application/json'
                                });
                                res.end("Failed to Update Details");
                            } else {
                                console.log("Success!", result);

                                res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                });
                                // var msg = "Login Successful";
                                res.end(JSON.stringify(result));
                            }
                        }
                    }).catch(error => {
                        console.log("RestaurantLogin - Index DB Error")
                    });
            }
        }).catch(error => {
            console.log("RestaurantLogin - Index DB Error")
        });
    });



    //start your server on port 3001
    app.listen(3001);
    console.log("Server Listening on port 3001");