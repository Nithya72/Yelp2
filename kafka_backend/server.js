var connection =  new require('./kafka/connection');
const mongoose = require('mongoose');
const { mongoURI } = require('../kafka_backend/utils/config');
//topics files

var customerSignup = require('./services/customer/customerSignup');
var customerSignin = require('./services/customer/customerSignin');
var searchRestaurants = require('./services/customer/searchRestaurants'); 
var updateCusProfile = require('./services/customer/updateCusProfile');
var getCustomerOrders = require('./services/customer/getCustomerOrders');
var placeCustomerOrders = require('./services/customer/placeCustomerOrders');
var getRegisteredEvents = require('./services/customer/getRegisteredEvents');
var registerToEvents = require('./services/customer/registerToEvents');
var getAllEvents = require('./services/customer/getAllEvents');
var postReviews = require('./services/customer/postReviews');
var loadCusMessage = require('./services/customer/loadCusMessage');
var sendCusMessage = require('./services/customer/sendCusMessage');
var getYelpUsers = require('./services/customer/getYelpUsers');
var followYelpUsers = require('./services/customer/followYelpUsers');
var customerProfilePic = require('./services/customer/updateProfilePic');

var resSignup = require('./services/restaurant/restaurantSignup');
var resSignin = require('./services/restaurant/restaurantSignin');
var updateResProfile = require('./services/restaurant/updateProfile');
var resGetOrders = require('./services/restaurant/getOrders');
var resUpdateOrders = require('./services/restaurant/updateOrders');
var resGetEvents = require('./services/restaurant/getEvents');
var resAddEvents = require('./services/restaurant/addEvents');
var resGetCustomer = require('./services/restaurant/getCustomer');
var resInitMessage = require('./services/restaurant/initMessage');
var resLoadMessage = require('./services/restaurant/resLoadMessage');
var resSendMessage = require('./services/restaurant/resSendMessage');
var resUpdateProfilePic = require('./services/restaurant/updateProfilePic'); 
var addMenu = require('./services/restaurant/addMenu');
var updateMenu = require('./services/restaurant/updateMenu');
var updateDishPic = require('./services/restaurant/updateDishPic');


function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('\n\n message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}


var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    poolSize: 500,
    bufferMaxEntries: 0
};

mongoose.connect(mongoURI, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log('Error connecting to DB: ', err);
    } else {
        console.log('Connected to MongoDB');
    }
});


//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("cus_signup",customerSignup);
handleTopicRequest("cus_signin",customerSignin);
handleTopicRequest("search_restaurants", searchRestaurants);
handleTopicRequest("update_cus_profile", updateCusProfile);
handleTopicRequest("place_cus_orders", placeCustomerOrders);
handleTopicRequest("get_cus_orders", getCustomerOrders);
handleTopicRequest("register_events", registerToEvents);
handleTopicRequest("get_registered_events", getRegisteredEvents);
handleTopicRequest("get_all_events", getAllEvents);
handleTopicRequest("cus_post_review", postReviews);
handleTopicRequest("cus_get_message", loadCusMessage);
handleTopicRequest("cus_send_message", sendCusMessage);
handleTopicRequest("get_yelp_users", getYelpUsers);
handleTopicRequest("follow_yelp_users", followYelpUsers);
handleTopicRequest("cus_profile_pic", customerProfilePic);

handleTopicRequest("res_signup", resSignup);
handleTopicRequest("res_signin", resSignin);
handleTopicRequest("res_update_profile", updateResProfile)
handleTopicRequest("res_get_orders", resGetOrders);
handleTopicRequest("res_update_orders", resUpdateOrders);
handleTopicRequest("res_get_events", resGetEvents);
handleTopicRequest("res_add_events", resAddEvents);
handleTopicRequest("update_menu", updateMenu);
handleTopicRequest("add_menu", addMenu);
handleTopicRequest("res_get_customer", resGetCustomer);
handleTopicRequest("res_init_message", resInitMessage);
handleTopicRequest("res_load_message", resLoadMessage);
handleTopicRequest("res_send_message", resSendMessage);
handleTopicRequest("res_profile_pic", resUpdateProfilePic);
handleTopicRequest("res_dish_pic", updateDishPic);