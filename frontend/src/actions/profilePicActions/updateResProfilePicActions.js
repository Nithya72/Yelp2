import axios from 'axios';
import configPath from '../../config';


const updateResProfilePicDispatcher = payload => {
    console.log("Inside updateResProfilePicDispatcher action: ", payload);
    return {
        type: "RESTAURANT_PROFILE_PIC_UPDATE",
        payload
    };
};

export const updateResProfilePic = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('rToken');
        axios.post(configPath.api_host + '/restaurant/profile/pic', payload)
            .then(response => {

                console.log("Actions: Restaurant Profile Update:", response);
                var restaurant = [response.data];

                if (response.status === 200) {
                    dispatch(updateResProfilePicDispatcher({
                        restaurant,
                        updateFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(updateResProfilePicDispatcher({
                    errorMsg: "Couldn't upload profile pic!",
                    updateFlag: false
                })
                );

            });
    };
};