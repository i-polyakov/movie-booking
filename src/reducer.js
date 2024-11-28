
import { combineReducers } from 'redux';
import common from './reducers/common';
import home from './reducers/home';
import movie from './reducers/movie';
import auth from './reducers/auth';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  common,
  home,
  movie,
  auth,
  router: routerReducer
});
