import axios from 'axios';
import configPath from '../../config';


const getEventRegistrationDispatcher = payload => {
    console.log("Inside Get Event Dispatcher action: ", payload);
    return {
        type: "GET_REGISTRATIONS",
        payload
    };
};

export const getEventRegistrations = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('rToken');
        axios.post(configPath.api_host + '/restaurant/events', payload)
            .then(response => {

                console.log("Actions - Get Event Status: ", response);
                var registeredUsers = response.data;

                if (response.status === 200) {

                    dispatch(getEventRegistrationDispatcher({
                        registeredUsers,
                        eventId: payload.id,
                        eventErrorMsg: null,
                        getRegistrationsFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(getEventRegistrationDispatcher({
                    registeredUsers: null,
                    eventId: payload.id,
                    eventErrorMsg: "No registrations yet!",
                    getRegistrationsFlag: false
                })
                );

            });
    };
};