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
        axios.get(configPath.api_host + '/customer/events')
            .then(response => {

                console.log("Actions - Get Event Status: ", response);
                var upcomingEvents = response.data;

                if (response.status === 200) {

                    dispatch(getCusEventDispatcher({
                        upcomingEvents,
                        errorMsg: null,
                        getEventFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(getCusEventDispatcher({
                    errorMsg: "No Events Posted yet!",
                    getEventFlag: false
                })
                );

            });
    };
};