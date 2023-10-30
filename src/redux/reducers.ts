import {combineReducers} from 'redux';

import AuthReducer from './auth';
import CommonReducer from './common';
import AssetsReducer from './assets';

export default combineReducers({
  auth: AuthReducer,
  common: CommonReducer,
  assets: AssetsReducer,
});
