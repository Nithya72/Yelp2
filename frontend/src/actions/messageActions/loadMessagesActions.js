import axios from 'axios';
import configPath from '../../config';


const loadMessagesDispatcher = payload => {
    console.log("Inside loadMessagesDispatcher action: ", payload);
    return {
        type: "CUSTOMER_MESSAGE",
        payload
    };
};

export const loadMessages = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.get(configPath.api_host + '/customer/message/' + payload)
            .then(response => {

                console.log("Actions: Customer Messages:", response);
                var custMsg = response.data;

                if (response.status === 200) {
                    dispatch(loadMessagesDispatcher({
                        custMsg,
                        chatMsg: null,
                        custMsgFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(loadMessagesDispatcher({
                    chatMsg: "Couldn't Get Message History!",
                    custMsgFlag: false
                })
                );

            });
    };
};

