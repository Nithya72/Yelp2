import axios from 'axios';
import configPath from '../../config';


const updateMenuDetailsDispatcher = payload => {
    console.log("Inside update Menu Details Dispatcher action: ", payload);
    return {
        type: "UPDATE_MENU_DETAILS",
        payload
    };
};

export const updateMenuDetails = (payload) => {

    return dispatch => {
        
        axios.post(configPath.api_host + '/updateMenu', payload)
            .then(response => {

                console.log("Actions - Update Menu:", response);
                var addMsg = response.data;

                if (response.status === 200) {

                    dispatch(updateMenuDetailsDispatcher({
                        addMsg,
                        updateFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(updateMenuDetailsDispatcher({
                    addMsg: "Couldn't add the dish! Try after sometime",
                    updateFlag: false
                })
                );

            });
    };
};