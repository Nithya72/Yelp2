import axios from 'axios';
import configPath from '../../config';
import jwt_decode from "jwt-decode";


const registerRestaurantDispatcher = payload => {
    console.log("Inside registerRestaurantDispatcher action: ", payload);
    return {
        type: "RESTAURANT_REGISTER",
        payload
    };
};


export const restaurantSignUp = (restaurant) => {

    return dispatch => {
        axios.post(configPath.api_host + '/restaurant/signup', restaurant)
            .then(response => {

                console.log("Actions: Restaurant Signup:", response);
                var decodedResponse = jwt_decode(response.data.token);

                console.log("response_msg: ", decodedResponse);

                var response_msg = decodedResponse.msg;

                if (response.status === 200) {
                    dispatch(registerRestaurantDispatcher({
                        response_msg,
                        registerFlag: true
                    })
                    );
                } else {
                    dispatch(registerRestaurantDispatcher({
                        response_msg,
                        registerFlag: false
                    })
                    );
                }
            }).catch(err => {
                dispatch(registerRestaurantDispatcher({
                    errorMsg: "Oops! We couldn't register you now. Try after sometime.",
                    registerFlag: false
                })
                );

            });
    };
};
