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
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.post(configPath.api_host + '/customer/yelp/users',payload)
            .then(response => {

                console.log("Actions - Updated Yelp Users List: ", response.data);
                var yelpUsersDetails = response.data.customers;
                var customer = [response.data.updated];

                console.log("Actions - yelpUsersDetails: ", yelpUsersDetails);
                console.log("Actions - customer: ", customer);

                if (response.status === 200) {

                    dispatch(followYelpUserDispatcher({
                        yelpUsersDetails,
                        customer,
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