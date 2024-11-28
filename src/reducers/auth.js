import {
  LOGIN_FAIL,
  LOGOUT,
  LOGIN,
  REGISTER
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...state, token: null, user: null };
    case LOGIN_FAIL:
      return {
        ...state,
        inProgress: false,
        error: action.payload
      }
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        inProgress: false,
        error: action.error ? action.error : null,
        user: action.payload.user,
        token: action.payload.token
      };
    default:
      return state;
  }
};
