import axios from 'axios';
import configPath from '../../config';


const updateResProfileDispatcher = payload => {
    console.log("Inside loginRestaurantDispatcher action: ", payload);
    return {
        type: "RESTAURANT_PROFILE_UPDATE",
        payload
    };
};

export const updateResProfile = (restaurant) => {

    return dispatch => {
        console.log("Inside update res profile actions: ", restaurant);
        
        axios.post(configPath.api_host + '/updateRestaurantProfile', restaurant)
            .then(response => {

                console.log("Actions: Restaurant Profile Update:", response);
                var restaurant = response.data;

                if (response.status === 200) {
                    dispatch(updateResProfileDispatcher({
                        restaurant,
                        updateFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(updateResProfileDispatcher({
                    error_msg: "Couldn't update profile!",
                    updateFlag: false
                })
                );

            });
    };
};