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
        
        axios.post(configPath.api_host + '/restaurant/profile', restaurant)
            .then(response => {

                console.log("Actions: Restaurant Profile Update:", response);
                var restaurant = [response.data];

                // const payload = {
                //     restaurant: [restaurant]
                // }

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
                    errorMsg: "Couldn't update profile!",
                    updateFlag: false
                })
                );

            });
    };
};