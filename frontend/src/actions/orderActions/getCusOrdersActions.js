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
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.get(configPath.api_host + '/customer/orders/' + payload)
            .then(response => {

                var orderDetails = response.data;
                console.log("Actions - Get Order Status: ", orderDetails);

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
                    getOrderFlag: false
                })
                );

            });
    };
};