
export const restaurantLogout = (payload) => {

    return dispatch => {
        
        dispatch({
            payload,
            type: "RESTAURANT_LOGOUT"
        });
    };
};