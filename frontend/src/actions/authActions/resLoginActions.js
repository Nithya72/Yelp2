import axios from 'axios';
import configPath from '../../config';


const loginRestaurantDispatcher = payload => {
    console.log("Inside loginRestaurantDispatcher action: ", payload);
    return {
        type: "RESTAURANT_LOGIN",
        payload
    };
};

export const restaurantLogin = (restaurant) => {

    return dispatch => {
        
        axios.post(configPath.api_host + '/restaurantLogin', restaurant)
            .then(response => {

                console.log("Actions: Restaurant Login:", response);
                var restaurant = response.data;

                if (response.status === 200) {
                    localStorage.setItem('restaurant', restaurant);
                    dispatch(loginRestaurantDispatcher({
                        restaurant,
                        loginFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(loginRestaurantDispatcher({
                    error_msg: "Invalid Username or Password",
                    loginFlag: false
                })
                );

            });
    };
};