import axios from 'axios';
import configPath from '../../config';


const cusSendMessageDispatcher = payload => {
    console.log("Inside cusSendMessageDispatcher action: ", payload);
    return {
        type: "CUSTOMER_SEND_MESSAGE",
        payload
    };
};

export const cusSendMessage = (payload) => {

    return dispatch => {

        axios.post(configPath.api_host + '/customer/message', payload)
            .then(response => {

                console.log("Actions: Restaurant Profile Update:", response);

                var custMsg = response.data;

                if (response.status === 200) {
                    dispatch(cusSendMessageDispatcher({
                        custMsg,
                        chatMsg: null,
                        custMsgFlag: true
                    })
                    );
                }

            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(cusSendMessageDispatcher({
                    chatMsg: "Couldn't Send Message!",
                    chatMsgFlag: false
                })
                );

            });
    };
};