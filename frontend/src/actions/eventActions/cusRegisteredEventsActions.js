import axios from 'axios';
import configPath from '../../config';


const cusRegisteredEventsDispatcher = payload => {
    console.log("Inside Get Customer Registered Event Dispatcher action: ", payload);
    return {
        type: "GET_CUSTOMER_EVENT",
        payload
    };
};

export const cusRegisteredEvents = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.get(configPath.api_host + '/customer/events/'+payload)
            .then(response => {

                var registeredEvents = response.data;
               console.log("Actions - registeredEvents: ", registeredEvents);

                if (response.status === 200) {

                    dispatch(cusRegisteredEventsDispatcher({
                        registeredEvents,
                        errorMsg: null,
                        getRegEventFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(cusRegisteredEventsDispatcher({
                    errorMsg: "No Events Posted yet!",
                    getRegEventFlag: false
                })
                );

            });
    };
};