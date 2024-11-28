import { APP_LOAD, ASYNC_END } from '../constants/actionTypes';

const defaultState = {
  appName: 'Кинотеатр',
  token: null

};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        appLoaded: true
      };
    case ASYNC_END:
      return { ...state, error: action.error, errorMessage: action.payload };
    default:
      return state;
  }
};
