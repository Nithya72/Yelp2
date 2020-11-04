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
        axios.defaults.headers.common['authorization'] = localStorage.getItem('rToken');
        axios.post(configPath.api_host + '/restaurant/menu/update', payload)
            .then(response => {

                console.log("Actions - Update Menu:", response);
                var restaurant = [response.data];

                if (response.status === 200) {

                    dispatch(updateMenuDetailsDispatcher({
                        restaurant,
                        updateFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(updateMenuDetailsDispatcher({
                    errorMsg: "Couldn't add the dish! Try after sometime",
                    updateFlag: false
                })
                );

            });
    };
};