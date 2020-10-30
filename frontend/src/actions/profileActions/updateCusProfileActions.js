import axios from 'axios';
import configPath from '../../config';


const updateCusProfileDispatcher = payload => {
    console.log("Inside updateCusProfileDispatcher action: ", payload);
    return {
        type: "CUSTOMER_PROFILE_UPDATE",
        payload
    };
};

export const updateCusProfile = (payload) => {

    return dispatch => {
        
        axios.post(configPath.api_host + '/customer/profile', payload)
            .then(response => {

                console.log("Actions: Customer Profile Update:", response);
                var customer = [response.data];

                if (response.status === 200) {
                    dispatch(updateCusProfileDispatcher({
                        customer,
                        updateFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(updateCusProfileDispatcher({
                    errorMsg: "Couldn't update profile!",
                    updateFlag: false
                })
                );

            });
    };
};