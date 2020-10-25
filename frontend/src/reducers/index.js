import { combineReducers } from 'redux';

import  auth  from './resAuthReducer';
import updateProfile from './resUpdateProfileReducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  auth,
  updateProfile,
  alert
});

export default rootReducer;