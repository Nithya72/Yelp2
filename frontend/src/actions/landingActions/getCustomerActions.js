
import axios from 'axios';
import configPath from '../../config';


const getCustomerDispatcher = payload => {
    console.log("Inside Get Customer Event Dispatcher action: ", payload);
    return {
        type: "GET_CUSTOMER_BY_ID",
        payload
    };
};

export const getCustomerById = (payload) => {

    return dispatch => {
        axios.get(configPath.api_host + '/restaurant/customer/'+payload)
            .then(response => {

                var customer = [response.data];
                console.log("Actions - Get Event Status: ", customer);

                if (response.status === 200) {
                    dispatch(getCustomerDispatcher({
                        customer,
                        getCustomerFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(getCustomerDispatcher({
                    getCustomerFlag: false
                })
                );

            });
    };
};