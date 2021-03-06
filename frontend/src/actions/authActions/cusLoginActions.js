import axios from 'axios';
import configPath from '../../config';
// import jwt_decode from "jwt-decode";

const loginCustomerDispatcher = payload => {
    console.log("Inside loginCustomerDispatcher action: ", payload);
    return {
        type: "CUSTOMER_LOGIN",
        payload
    };
};

export const customerLogin = (restaurant) => {

    return dispatch => {
        axios.defaults.withCredentials = true;
        axios.post(configPath.api_host + '/customer/login', restaurant)
            .then(response => {

                console.log("response.data: ", response.data);
                // var decodedResponse = jwt_decode(response.data.token);
                var restaurants = response.data.payload.restaurants;
                var customer = response.data.payload.customer;

                if (response.status === 200) {
                    localStorage.setItem('cToken', response.data.token);

                    dispatch(loginCustomerDispatcher({
                        customer,
                        restaurants,
                        errorMsg: null,
                        loginFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(loginCustomerDispatcher({
                    //type: "CUSTOMER_LOGOUT",
                    errorMsg: "Invalid Username or Password",
                    restaurants: null,
                    customer: null,
                    loginFlag: false
                })
                );

            });
    };
};