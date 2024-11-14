import { CREATE_MOVIE_PAGE_LOADED, CREATE_MOVIE_PAGE_UNLOADED, MOVIE_PAGE_LOADED } from '../constants/actionTypes';

const defaultState = {
  genres: [],
  showtimes: []
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_MOVIE_PAGE_LOADED:
      return {
        ...state,
        genres: action.payload
      };
      case MOVIE_PAGE_LOADED:
        return {
          ...state,
          movie: action.payload[0],
          showtimes: action.payload[1],
          genres: action.payload[2]
        };
    case CREATE_MOVIE_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
