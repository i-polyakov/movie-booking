import { CREATE_BOOKINGS, CREATE_MOVIE_PAGE_LOADED, CREATE_MOVIE_PAGE_UNLOADED, MOVIE_PAGE_LOADED, SELECT_SEAT_PAGE_LOADED, DELETE_BOOKING } from '../constants/actionTypes';

const defaultState = {
  genres: [],
  showtimes: [],
  seats:[],
  bookings: [],
  halls: []
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
    // case DELETE_BOOKING:
    //   return {
    //     ...state,
    //     bookings: state.bookings.filter(booking => booking.id !== action.payload.id)
    //   };
    case MOVIE_PAGE_LOADED:
      return {
        ...state,
        movie: action.payload[0],
        showtimes: action.payload[1],
        genres: action.payload[2],
        seats: action.payload[3],
        halls: action.payload[4]
      };
    case SELECT_SEAT_PAGE_LOADED:
      return {
        ...state,
        movie: action.payload[0],
        showtime: action.payload[1],
        seats: action.payload[2],
        bookedSeats: action.payload[3],
        halls: action.payload[4]
      };
    case CREATE_MOVIE_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
