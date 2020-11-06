var connection =  new require('./kafka/connection');
const mongoose = require('mongoose');
const { mongoURI } = require('../kafka_backend/utils/config');
//topics files

var customerSignup = require('./services/customerSignup');
var customerSignin = require('./services/customerSignin');
var searchRestaurants = require('./services/searchRestaurants'); 
var updateCusProfile = require('./services/updateCusProfile');
var getCustomerOrders = require('./services/getCustomerOrders');
var placeCustomerOrders = require('./services/placeCustomerOrders');
var getRegisteredEvents = require('./services/getRegisteredEvents');
var registerToEvents = require('./services/registerToEvents');
var getAllEvents = require('./services/getAllEvents');
var postReviews = require('./services/postReviews');
var loadCusMessage = require('./services/loadCusMessage');
var sendCusMessage = require('./services/sendCusMessage');

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
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
