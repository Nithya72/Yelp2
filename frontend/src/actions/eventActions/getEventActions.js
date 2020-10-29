import axios from 'axios';
import configPath from '../../config';


const getEventDispatcher = payload => {
    console.log("Inside Get Event Dispatcher action: ", payload);
    return {
        type: "GET_EVENT",
        payload
    };
};

export const getEvents = (payload) => {

    return dispatch => {

        axios.post(configPath.api_host + '/restaurant/events', payload)
            .then(response => {

                console.log("Actions - Get Event Status: ", response);
                var eventDetails = response.data;

                if (response.status === 200) {

                    dispatch(getEventDispatcher({
                        eventDetails,
                        errorMsg: null,
                        getEventFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(getEventDispatcher({
                    errorMsg: "No Events Posted yet!",
                    getEventFlag: false
                })
                );

            });
    };
};