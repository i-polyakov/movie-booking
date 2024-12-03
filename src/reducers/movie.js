import {CREATE_REVIEW, CREATE_REVIEW_PAGE_LOADED,CREATE_SHOWTIME,CREATE_SHOWTIME_PAGE_LOADED, CREATE_BOOKINGS, CREATE_MOVIE_PAGE_LOADED, 
   MOVIE_PAGE_LOADED, SELECT_SEAT_PAGE_LOADED } from '../constants/actionTypes';

const defaultState = {
  genres: [],
  showtimes: [],
  seats:[],
  bookings: [],
  halls: [],
  reviews: []
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_MOVIE_PAGE_LOADED:
      return {
        ...state,
        genres: action.payload
      };
    case CREATE_BOOKINGS:
      return {
        ...state,
        bookings: action.payload
      };
    case MOVIE_PAGE_LOADED:
      return {
        ...state,
        movie: action.payload[0],
        showtimes: action.payload[1],
        seats: action.payload[2]
      };
    case SELECT_SEAT_PAGE_LOADED:
      return {
        ...state,
        movie: action.payload[0],
        showtime: action.payload[1],
        seats: action.payload[2],
        bookedSeats: action.payload[3]
      };
      case CREATE_REVIEW_PAGE_LOADED:
        return {
          ...state,
          reviews: action.payload.reverse()
        };
      case CREATE_REVIEW:
        return {
          ...state,
          reviews: [...state.reviews,action.payload]
        };
      case CREATE_SHOWTIME:
        return {
          ...state,
          showtimes: [...state.showtimes, action.payload]
        };
      case CREATE_SHOWTIME_PAGE_LOADED:
        return {
          ...state,
          movie: action.payload[0],
          showtimes: action.payload[1],
          halls: action.payload[2]
        };

    default:
      return state;
  }
};
