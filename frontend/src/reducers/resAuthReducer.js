
const initialState = {
  isAuthenticated: null,
  loading: true
}

const auth = (state = initialState, action) => {

  const{ type, payload } = action;

  switch (type) {

    case "RESTAURANT_REGISTER":
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
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
          loading: false
    }

    case "RESTAURANT_LOGOUT":
      return initialState;
    
    default:
      return state;
  }
}

export default auth;