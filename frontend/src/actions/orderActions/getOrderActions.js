import axios from 'axios';
import configPath from '../../config';


const getOrderDispatcher = payload => {
    console.log("Inside Get Order Dispatcher action: ", payload);
    return {
        type: "GET_ORDER",
        payload
    };
};

export const getOrders = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('rToken');
        axios.get(configPath.api_host + '/restaurant/orders/'+payload)
            .then(response => {

                console.log("Actions - Get Order Status: ", response);
                var orderDetails = response.data;

                if (response.status === 200) {

                    dispatch(getOrderDispatcher({
                        orderDetails,
                        getOrderFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(getOrderDispatcher({
                    errorMsg: "No Orders yet!",
                    getOrderFlag: false
                })
                );

            });
    };
};