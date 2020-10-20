export const restaurantService = {
    restaurantLogin,
    restaurantLogout,
    restaurantSignup,
    updateRestProfile
};

function restaurantLogin(restEmailID, restPassword) {

    var reqPromise = require('request-promise');
    const options = {
        method: 'POST',
        uri: 'http://localhost:3001/restaurantLogin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            restEmailID,
            restPassword
        })
    };

    return reqPromise(options)
    .then(function(response){
        console.log("restaurantLogin Promise - then: ", response);
        return response;
    })
    .catch(function(err) {
        console.log("restaurantLogin Promise - catch: ", err);
        return err;
    });


}

// remove user from local storage to log user out
function restaurantLogout() {
    localStorage.removeItem('restaurant');
}

// register user request
function restaurantSignup(restaurant) {
    var reqPromise = require('request-promise');

    const options = {
        method: 'POST',
        uri: 'http://localhost:3001/restaurantSignUp',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurant)
    };

    return reqPromise(options)
    .then(function(response){
        return response;
    })
    .catch(function(err) {
        return err;
    });

}


function updateRestProfile(restaurant) {

    console.log(" updateRestProfile: ", restaurant)

    var reqPromise = require('request-promise');
    const options = {
        method: 'POST',
        uri: 'http://localhost:3001/updateRestaurantProfile',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            restaurant
        })
    };

    return reqPromise(options)
    .then(function(response){
        return response;
    })
    .catch(function(err) {
        return err;
    });


}