import axios from 'axios';
import configPath from '../../config';


const resLoadMessagesDispatcher = payload => {
    console.log("Inside loadMessagesDispatcher action: ", payload);
    return {
        type: "RESTAURANT_MESSAGE",
        payload
    };
};

export const resLoadMessages = (payload) => {

    return dispatch => {

        axios.get(configPath.api_host + '/restaurant/messages/' + payload)
            .then(response => {

                console.log("Actions: Restaurant Messages:", response);
                var restMsg = response.data;

                if (response.status === 200) {
                    dispatch(resLoadMessagesDispatcher({
                        restMsg,
                        chatMsg: null,
                        restMsgFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(resLoadMessagesDispatcher({
                    chatMsg: "Couldn't Get Message History!",
                    restMsgFlag: false
                })
                );

            });
    };
};

