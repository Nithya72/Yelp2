import axios from 'axios';
import configPath from '../../config';


const addMenuDetailsDispatcher = payload => {
    console.log("Inside addMenuDispatcher action: ", payload);
    return {
        type: "ADD_MENU_DETAILS",
        payload
    };
};

export const addMenuDetails = (payload) => {

    return dispatch => {
        
        axios.post(configPath.api_host + '/addMenu', payload)
            .then(response => {

                console.log("Actions - Add Menu:", response);
                var addMsg = response.data;

                if (response.status === 200) {

                    dispatch(addMenuDetailsDispatcher({
                        addMsg,
                        addFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(addMenuDetailsDispatcher({
                    addMsg: "Couldn't add the dish! Try after sometime",
                    addFlag: false
                })
                );

            });
    };
};