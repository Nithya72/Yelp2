
// const initialState = {
//     // token: localStorage.getItem('token'),
//     // restaurant: localStorage.getItem('restaurant') != null ? JSON.parse(localStorage.getItem('restaurant')) : "",
//     isAuthenticated: null,
//     loading: true,
//     // user: null
//   }
  
//   const updateProfile = (state = initialState, action) => {
  
//     const{ type, payload } = action;
  
//     switch (type) {
  
//       case "RESTAURANT_PROFILE_UPDATE":
//         return{
//           ...state,
//           ...payload,
//           isAuthenticated: true,
//           loading: false
//         }
      
//       default:
//         return state
//     }
//   }
  
//   export default updateProfile;