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
        
        axios.post(configPath.api_host + '/restaurant/menu', payload)
            .then(response => {
                var restaurant = [response.data];
                console.log("Actions - Add Menu:", restaurant);

                if (response.status === 200) {
                    dispatch(addMenuDetailsDispatcher({
                        errorMsg: "",
                        restaurant,
                        addFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(addMenuDetailsDispatcher({
                    errorMsg: "Couldn't add the dish! Try after sometime",
                    addFlag: false
                })
                );

            });
    };
};