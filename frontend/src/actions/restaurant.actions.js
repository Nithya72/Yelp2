import { userConstants } from '../constants/';
import { restaurantService } from '../services/';
// import { alertActions } from './';
import { setAlert } from './alert.actions';
import { history } from '../helpers';
import axios from 'axios';

export const restaurantActions = {
    restaurantSignIn,
    restaurantSignOut,
    // restaurantSignUp,
    updateRestProfile
};

function restaurantSignIn(restEmailId, restPassword) {

    return dispatch => {
        dispatch(request({
            restEmailId
        }));

        restaurantService.restaurantLogin(restEmailId, restPassword) //restaurant.Service.js
            .then(
                restaurant => {
                    console.log("--------------- success --------------", restaurant);

                    if (restaurant.statusCode === 402 || restaurant.statusCode === 401) {
                        dispatch(loginInvalid(restaurant));
                        // dispatch(alertActions.error(restaurant));

                        console.log("Error msg: ", restaurant.error);
                        history.push({ pathname: '/restaurantLogin', state: { alert: restaurant.error} });

                    } else {
                        dispatch(loginSuccess(restaurant));
                        history.push({ pathname: '/restaurantProfile', state: { restaurant: restaurant } });
                    }
                },
                error => {
                    console.log("--------------- error --------------", error);

                    dispatch(loginInvalid(error));
                    // dispatch(alertActions.error(error));
                }
            );
    };

    function request(restaurant) { return { type: userConstants.LOGIN_REQUEST, restaurant } }
    function loginSuccess(restaurant) { return { type: userConstants.LOGIN_SUCCESS, restaurant } }
    function loginInvalid(error) { return { type: userConstants.LOGIN_FAILURE, error } }

}

 export const restaurantSignUp = (restaurant) => async dispatch => {

            try{
                const res = await axios.post('http://localhost:3001/restaurantSignUp', restaurant);
                console.log("after db call:", res)
                dispatch({
                    type: "SIGNUP_SUCCESS",
                    payload: res.data
                });  
                
            }
            catch(err){
                const errors = err.response.data.errors;
                if (errors) {
                    errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
                }
                dispatch({
                    type: "SIGNUP_FAIL"
                })
            }
    }

//     function signupRequest(restaurant) {
//         return {
//             type: userConstants.SIGNUP_REQUEST, restaurant
//         }
//     }

//     function signupSuccess(restaurant) {
//         return {
//             type: userConstants.SIGNUP_SUCCESS, restaurant
//         }
//     }

//     function signupInvalid(error) {
//         return {
//             type: userConstants.SIGNUP_FAILURE, error
//         }
//     }
// }

function restaurantSignOut() {
    restaurantService.restaurantLogout();
    return {
        type: userConstants.LOGOUT
    };
}


function updateRestProfile(restaurant) {

    return dispatch => {
        dispatch(request({
            restaurant
        }));

        restaurantService.updateRestProfile(restaurant) //restaurant.Service.js
            .then(
                restaurant => {
                    console.log("--------------- success --------------", restaurant);
                    dispatch(loginSuccess(restaurant));
                    history.push({ pathname: '/restaurantProfile', state: { restaurant: restaurant } });
                },
                error => {
                    console.log("--------------- error --------------", error);

                    dispatch(loginInvalid(error));
                    // dispatch(alertActions.error(error));
                }
            );
    };

    function request(restaurant) { return { type: userConstants.LOGIN_REQUEST, restaurant } }

    function loginSuccess(restaurant) { return { type: userConstants.LOGIN_SUCCESS, restaurant } }

    function loginInvalid(error) { return { type: userConstants.LOGIN_FAILURE, error } }

}