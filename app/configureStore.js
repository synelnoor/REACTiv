/* eslint import/no-extraneous-dependencies: 0 */
/* eslint global-require: 0 */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { connect } from 'react-redux';
import { reduxifyNavigator, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import thunk from 'redux-thunk';
import reducer from './reducers';

export default function configureStore(AppNavigator, Router, key) {
  const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams(key));
  const navReducer = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
  };

  const appReducer = combineReducers({
    nav: navReducer,
    reducer,
  });

  const middleware = createReactNavigationReduxMiddleware('root', state => state.nav);
  const ReduxNavigator = reduxifyNavigator(AppNavigator, 'root');
  const mapStateToProps = state => ({
    state: state.nav,
  });
  const ReduxRouter = connect(mapStateToProps)(Router);
  const store = createStore(appReducer, applyMiddleware(thunk, middleware));

  return { ReduxNavigator, ReduxRouter, store };
}
