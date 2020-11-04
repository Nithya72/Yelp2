import axios from 'axios';
import configPath from '../../config';


const searchRestaurantDispatcher = payload => {
    console.log("Inside Get Order Dispatcher action: ", payload);
    return {
        type: "SEARCH_RESTAURANTS",
        payload
    };
};

export const searchRestaurants = (payload) => {

    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('cToken');
        axios.post(configPath.api_host + '/customer/search/restaurants', payload)
            .then(response => {

                console.log("Actions - Search Results: ", response.data);
                var restaurants = response.data;

                if (response.status === 200) {

                    dispatch(searchRestaurantDispatcher({
                        restaurants,
                        errorMsg: null,
                        searchFlag: true
                    })
                    );
                 }
            }).catch(err => {
                console.log("error: ", err.data);

                dispatch(searchRestaurantDispatcher({
                    restaurants: null,
                     errorMsg: "No Search Result Found!",
                     searchFlag: false
                })
                );

            });
    };
};