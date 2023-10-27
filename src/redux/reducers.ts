import {combineReducers} from 'redux';

import AuthReducer from './auth';
import CommonReducer from './common';

export default combineReducers({
  auth: AuthReducer,
  common: CommonReducer,
});
