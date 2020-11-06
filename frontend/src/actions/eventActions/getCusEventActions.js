import axios from 'axios';
import configPath from '../../config';


const getCusEventDispatcher = payload => {
    console.log("Inside Get Customer Event Dispatcher action: ", payload);
    return {
        type: "GET_CUSTOMER_EVENT",
        payload
    };
};

export const getCusEvents = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.get(configPath.api_host + '/customer/allevents')
            .then(response => {

                var upcomingEvents = response.data;
                console.log("Actions - Get Event Status: ", upcomingEvents);

                if (response.status === 200) {

                    dispatch(getCusEventDispatcher({
                        upcomingEvents,
                        getEventFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(getCusEventDispatcher({
                    getEventFlag: false
                })
                );

            });
    };
};