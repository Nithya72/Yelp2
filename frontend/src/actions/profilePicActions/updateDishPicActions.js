import axios from 'axios';
import configPath from '../../config';


const updateDishPicDispatcher = payload => {
    console.log("Inside updateDishPicDispatcher action: ", payload);
    return {
        type: "DISH_PIC_UPDATE",
        payload
    };
};

export const updateDishPic = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('rToken');
        axios.post(configPath.api_host + '/restaurant/menu/pic', payload)
            .then(response => {

                console.log("Actions: Dish Pic Update:", response);
                var restaurant = [response.data];

                if (response.status === 200) {
                    dispatch(updateDishPicDispatcher({
                        restaurant,
                        updateFlag: true
                    })
                    );
                }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(updateDishPicDispatcher({
                    errorMsg: "Couldn't upload profile pic!",
                    updateFlag: false
                })
                );

            });
    };
};