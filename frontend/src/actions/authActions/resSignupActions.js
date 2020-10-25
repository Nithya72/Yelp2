import axios from 'axios';
import configPath from '../../config';


const registerRestaurantDispatcher = payload => {
    console.log("Inside registerRestaurantDispatcher action: ", payload);
    return {
        type: "RESTAURANT_REGISTER",
        payload
    };
};


export const restaurantSignUp = (restaurant) => {

    return dispatch => {
        axios.post(configPath.api_host + '/restaurantSignUp', restaurant)
            .then(response => {

                console.log("Actions: Restaurant Signup:", response);
                var response_msg = response.data;

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
                    res: "Oops! We couldn't register you now. Try after sometime.",
                    registerFlag: false
                })
                );

            });
    };
};
