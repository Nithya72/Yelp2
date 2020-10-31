
const initialState = {
    token: localStorage.getItem('cToken'),
    isAuthenticated: false
  }
  
  const cusStore = (state = initialState, action) => {
  
    const{ type, payload } = action;
  
    switch (type) {
  
      case "CUSTOMER_REGISTER":
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
        }
  
      case "CUSTOMER_LOGIN":
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
        }
  
      case "CUSTOMER_LOGOUT":
        localStorage.removeItem('cToken');
        return initialState;

      case "SEARCH_RESTAURANTS":
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
        }

      case "CUSTOMER_PROFILE_UPDATE":
        return{
          ...state,
          ...payload,
          isAuthenticated: true,
        }

      case "PLACE_ORDER":
        return{
          ...state,
          ...payload,
          isAuthenticated: true,
        }

      case "GET_CUSTOMER_ORDER":
        return{
          ...state,
          ...payload,
          isAuthenticated: true,
        }

      case "GET_CUSTOMER_EVENT":
        return{
          ...state,
          ...payload,
          isAuthenticated: true,
        }
  
      default:
        return state;
    }
  }
  
  export default cusStore;