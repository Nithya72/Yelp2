
export const customerLogout = (payload) => {

    return dispatch => {
        dispatch({
            payload,
            type: "CUSTOMER_LOGOUT"
        });
    };
};