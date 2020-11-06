import axios from 'axios';
import configPath from '../../config';


const placeOrderDispatcher = payload => {
    console.log("Inside Place Order Dispatcher action: ", payload);
    return {
        type: "PLACE_ORDER",
        payload
    };
};

export const placeOrder = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.post(configPath.api_host + '/customer/orders', payload)
            .then(response => {

                console.log("Actions - Place Order Status: ", response);
                var successMsg = response.data;

                if (response.status === 200) {

                    dispatch(placeOrderDispatcher({
                        errorMsg: null,
                        successMsg,
                        placeOrderFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(placeOrderDispatcher({
                    successMsg: null,
                    errorMsg: "Couldn't place the order. Try after sometime!",
                    placeOrderFlag: false
                })
                );

            });
    };
};