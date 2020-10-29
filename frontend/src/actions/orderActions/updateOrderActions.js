import axios from 'axios';
import configPath from '../../config';


const updateOrderDispatcher = payload => {
    console.log("Inside updateOrder Dispatcher action: ", payload);
    return {
        type: "UPDATE_ORDER",
        payload
    };
};

export const updateOrder = (payload) => {

    return dispatch => {
        
        axios.post(configPath.api_host + '/updateOrders', payload)
            .then(response => {

                console.log("Actions - Update Order Status: ", response);
                var orderDetails = response.data;

                if (response.status === 200) {

                    dispatch(updateOrderDispatcher({
                        orderDetails
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(updateOrderDispatcher({
                    errorMsg: "Couldn't update the order! Try after sometime"
                })
                );

            });
    };
};