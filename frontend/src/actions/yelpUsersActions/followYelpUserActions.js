import axios from 'axios';
import configPath from '../../config';


const followYelpUserDispatcher = payload => {
    console.log("Inside followYelpUserDispatcher action: ", payload);
    return {
        type: "FOLLOW_YELP_USERS",
        payload
    };
};

export const followYelpUser = (payload) => {

    return dispatch => {

        axios.post(configPath.api_host + '/customer/yelp/users',payload)
            .then(response => {

                var yelpUsersDetails = response.data;
                console.log("Actions - Get Order Status: ", yelpUsersDetails);

                if (response.status === 200) {

                    dispatch(followYelpUserDispatcher({
                        yelpUsersDetails,
                        getYelpUserFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(followYelpUserDispatcher({
                    getYelpUserFlag: false
                })
                );

            });
    };
};