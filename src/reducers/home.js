import { HOME_PAGE_LOADED } from '../constants/actionTypes';

const defaultState = {
  movies: []
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        movies: action.payload
      };
    default:
      return state;
  }
};
