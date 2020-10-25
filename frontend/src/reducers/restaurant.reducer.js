
const initialState = {
  isAuthenticated: null,
  loading: true
}

const resState = (state = initialState, action) => {

  const{ type, payload } = action;

  switch (type) {

    case "RESTAURANT_REGISTER":
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        // loading: false
      }

    case "RESTAURANT_LOGIN":
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      }

    case "RESTAURANT_PROFILE_UPDATE":
        return{
          ...state,
          ...payload,
          isAuthenticated: true,
          // loading: false
    }

    case "RESTAURANT_LOGOUT":
      return initialState;

    case "ADD_MENU":
      return{
        ...state,
        ...payload,
        isAuthenticated: true,
        // loading: false
      }

    case "ADD_MENU_DETAILS":
      return{
        ...state,
        ...payload,
        isAuthenticated: true,
        // loading: false
      }

    case "UPDATE_MENU_DETAILS":
      return{
        ...state,
        ...payload,
        isAuthenticated: true
      }
    
    default:
      return state;
  }
}

export default resState;