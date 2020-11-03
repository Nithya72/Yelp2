
import axios from 'axios';
import configPath from '../../config';


const getYelpUsersDispatcher = payload => {
    console.log("Inside Get Order Dispatcher action: ", payload);
    return {
        type: "GET_YELP_USERS",
        payload
    };
};

export const getYelpUsers = (payload) => {

    return dispatch => {

        axios.get(configPath.api_host + '/customer/yelp/users/'+payload)
            .then(response => {

                var yelpUsersDetails = response.data;
                console.log("Actions - Get Order Status: ", yelpUsersDetails);

                if (response.status === 200) {

                    dispatch(getYelpUsersDispatcher({
                        yelpUsersDetails,
                        getYelpUserFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(getYelpUsersDispatcher({
                    getYelpUserFlag: false
                })
                );

            });
    };
};