import { combineReducers } from 'redux';

import routeReducer from './route-reducer';
import camera from './camera';

export default combineReducers({
  route: routeReducer,
  camera
});