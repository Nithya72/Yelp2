import axios from 'axios';
import configPath from '../../config';


const updateCusProfilePicDispatcher = payload => {
    console.log("Inside updateCusProfilePicDispatcher action: ", payload);
    return {
        type: "CUSTOMER_PROFILE_PIC_UPDATE",
        payload
    };
};

export const updateCusProfilePic = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.post(configPath.api_host + '/customer/profile/pic', payload)
            .then(response => {

                console.log("Actions: Customer Profile Update:", response);
                var customer = [response.data];

                if (response.status === 200) {
                    dispatch(updateCusProfilePicDispatcher({
                        customer,
                        updateFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(updateCusProfilePicDispatcher({
                    errorMsg: "Couldn't upload profile pic!",
                    updateFlag: false
                })
                );

            });
    };
};