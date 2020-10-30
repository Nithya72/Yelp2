import axios from 'axios';
import configPath from '../../config';
import jwt_decode from "jwt-decode";


const registerCustomerDispatcher = payload => {
    console.log("Inside registerCustomerDispatcher action: ", payload);
    return {
        type: "CUSTOMER_REGISTER",
        payload
    };
};


export const customerSignUp = (payload) => {

    return dispatch => {
        axios.post(configPath.api_host + '/customer/signup', payload)
            .then(response => {

                console.log("Actions: Customer Signup:", response);
                var decodedResponse = jwt_decode(response.data.token);

                console.log("response_msg: ", decodedResponse);

                var response_msg = decodedResponse.msg;

                if (response.status === 200) {
                    dispatch(registerCustomerDispatcher({
                        response_msg,
                        registerFlag: true
                    })
                    );
                } else {
                    dispatch(registerCustomerDispatcher({
                        response_msg,
                        registerFlag: false
                    })
                    );
                }
            }).catch(err => {
                dispatch(registerCustomerDispatcher({
                    response_msg: "Oops! We couldn't register you now. Try after sometime.",
                    registerFlag: false
                })
                );

            });
    };
};
