import axios from 'axios';
import configPath from '../../config';


const postEventDispatcher = payload => {
    console.log("Inside Get Event Dispatcher action: ", payload);
    return {
        type: "POST_EVENT",
        payload
    };
};

export const postEvent = (payload) => {

    return dispatch => {
        
        axios.post(configPath.api_host + '/restaurant/event/add', payload)
            .then(response => {

                console.log("Actions - Post Event Status: ", response);
                var postEventMsg = response.data;

                if (response.status === 200) {

                    dispatch(postEventDispatcher({
                        postEventMsg,
                        postEventFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(postEventDispatcher({
                    postEventMsg: "Couldn't post an event! Try after sometime.",
                    postEventFlag: false
                })
                );

            });
    };
};