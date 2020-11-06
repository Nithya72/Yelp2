import axios from 'axios';
import configPath from '../../config';


const updateResProfileDispatcher = payload => {
    console.log("Inside updateResProfileDispatcher action: ", payload);
    return {
        type: "RESTAURANT_PROFILE_UPDATE",
        payload
    };
};

export const updateResProfile = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('rToken');
        axios.post(configPath.api_host + '/restaurant/profile', payload)
            .then(response => {

                console.log("Actions: Restaurant Profile Update:", response);
                var restaurant = [response.data];

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