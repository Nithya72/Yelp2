import axios from 'axios';
import configPath from '../../config';


const registerEventDispatcher = payload => {
    console.log("Inside Get Event Dispatcher action: ", payload);
    return {
        type: "REGISTER_EVENT",
        payload
    };
};

export const registerEvent = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.post(configPath.api_host + '/customer/events', payload)
            .then(response => {

                console.log("Actions - Post Event Status: ", response);
                var postEventMsg = response.data;

                if (response.status === 200) {

                    dispatch(registerEventDispatcher({
                        postEventMsg,
                        postEventFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(registerEventDispatcher({
                    postEventMsg: "Couldn't register now! Try after sometime.",
                    postEventFlag: false
                })
                );

            });
    };
};