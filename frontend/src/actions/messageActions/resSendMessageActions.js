import axios from 'axios';
import configPath from '../../config';


const resSendMessageDispatcher = payload => {
    console.log("Inside resSendMessageDispatcher action: ", payload);
    return {
        type: "RESTAURANT_SEND_MESSAGE",
        payload
    };
};

export const resSendMessage = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('rToken');
        axios.post(configPath.api_host + '/restaurant/messages', payload)
            .then(response => {

                console.log("Actions: Restaurant Message:", response);

                var restMsg = response.data;

                if (response.status === 200) {
                    dispatch(resSendMessageDispatcher({
                        restMsg,
                        chatMsg: null,
                        restMsgFlag: true
                    })
                    );
                }

            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(resSendMessageDispatcher({
                    chatMsg: "Couldn't Send Message!",
                    restMsgFlag: false
                })
                );

            });
    };
};