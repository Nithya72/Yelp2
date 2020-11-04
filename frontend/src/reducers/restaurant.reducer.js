
const initialState = {
  token: localStorage.getItem('rToken'),
  isAuthenticated: false,
  // loading: true
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
      localStorage.removeItem('rToken');
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

      case "GET_ORDER":
        return{
          ...state,
          ...payload,
          isAuthenticated: true
        }

      case "UPDATE_ORDER":
        return{
          ...state,
          ...payload,
          isAuthenticated: true,
        }

        case "GET_EVENT":
          return{
            ...state,
            ...payload,
            isAuthenticated: true
          }

        case "GET_REGISTRATIONS":
          return{
            ...state,
            ...payload,
            isAuthenticated: true
          }

        case "POST_EVENT":
          return{
            ...state,
            ...payload,
            isAuthenticated: true
          }

        case "RESTAURANT_MESSAGE":
          return{
            ...state,
            ...payload,
            isAuthenticated: true
          }

        case "RESTAURANT_SEND_MESSAGE":
          return{
            ...state,
            ...payload,
            isAuthenticated: true
          }

        case "RESTAURANT_PROFILE_PIC_UPDATE":
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