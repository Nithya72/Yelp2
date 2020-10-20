import { combineReducers } from 'redux';

import { login } from './login.reducer';
import { signup } from './signup.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  login,
  signup,
  alert
});

export default rootReducer;