import axios from 'axios';
import configPath from '../../config';


const getCusOrdersDispatcher = payload => {
    console.log("Inside Get Order Dispatcher action: ", payload);
    return {
        type: "GET_CUSTOMER_ORDER",
        payload
    };
};

export const getCusOrders = (payload) => {

    return dispatch => {

        axios.get(configPath.api_host + '/customer/orders/' + payload)
            .then(response => {

                console.log("Actions - Get Order Status: ", response);
                var orderDetails = response.data;

                if (response.status === 200) {

                    dispatch(getCusOrdersDispatcher({
                        orderDetails,
                        getOrderFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(getCusOrdersDispatcher({
                    errorMsg: "No Orders yet!",
                    getOrderFlag: false
                })
                );

            });
    };
};