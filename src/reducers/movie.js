import { CREATE_MOVIE_PAGE_LOADED, CREATE_MOVIE_PAGE_UNLOADED } from '../constants/actionTypes';

const defaultState = {
  genres: []
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_MOVIE_PAGE_LOADED:
      return {
        ...state,
        genres: action.payload
      };
    case CREATE_MOVIE_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
