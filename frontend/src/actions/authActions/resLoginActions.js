import axios from 'axios';
import configPath from '../../config';
import jwt_decode from "jwt-decode";

const loginRestaurantDispatcher = payload => {
    console.log("Inside loginRestaurantDispatcher action: ", payload);
    return {
        type: "RESTAURANT_LOGIN",
        payload
    };
};

export const restaurantLogin = (restaurant) => {

    return dispatch => {
        axios.defaults.withCredentials = true;
        axios.post(configPath.api_host + '/restaurant/login', restaurant)
            .then(response => {
         
                var decodedResponse = jwt_decode(response.data);
                var restaurant = decodedResponse.restaurant;

                if (response.status === 200) {
                    localStorage.setItem('rToken', response.data);

                    dispatch(loginRestaurantDispatcher({
                        restaurant,
                        loginFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(loginRestaurantDispatcher({
                    //type: "RESTAURANT_LOGOUT",
                    errorMsg: "Invalid Username or Password",
                    loginFlag: false
                })
                );

            });
    };
};