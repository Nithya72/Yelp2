import axios from 'axios';
import configPath from '../../config';


const sendMessageDispatcher = payload => {
    console.log("Inside updateResProfileDispatcher action: ", payload);
    return {
        type: "RESTAURANT_MESSAGE",
        payload
    };
};

export const sendMessage = (payload) => {

    return dispatch => {

        axios.post(configPath.api_host + '/restaurant/message', payload)
            .then(response => {

                console.log("Actions: Restaurant Profile Update:", response);
                var chatMsg = response.data;

                if (response.status === 200) {
                    dispatch(sendMessageDispatcher({
                        chatMsg,
                        chatMsgFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(sendMessageDispatcher({
                    chatMsg: "Couldn't Send Message!",
                    chatMsgFlag: false
                })
                );

            });
    };
};