import { combineReducers } from 'redux';

import  resState  from './restaurant.reducer';
import  cusStore  from './customer.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  resState,
  cusStore,
  alert
});

export default rootReducer;