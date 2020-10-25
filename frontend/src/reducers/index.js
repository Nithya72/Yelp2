import { combineReducers } from 'redux';

import  resState  from './restaurant.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  resState,
  alert
});

export default rootReducer;