import { userConstants } from '../constants';
 
let restaurant = JSON.parse(localStorage.getItem('restaurant'));
const initialState = restaurant ? { loggedIn: true, restaurant } : {};
 
export function login(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
    return {
      loggingIn: true,
      restaurant: action.restaurant
    };
    case userConstants.LOGIN_SUCCESS:
    return {
      loggedIn: true,
      restaurant: action.restaurant
    };
    case userConstants.LOGIN_FAILURE:
    return {};
    case userConstants.LOGOUT:
    return {};
    default:
    return state
  }
}