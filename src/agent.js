import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:3000';

const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}


const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};


const Auth = {
  login: (login, password) =>
    requests.get(`/users?login=${login}&password=${password}`),
  register:  (user) => 
     requests.post('/users', {...user}),
  check:(login) =>
  requests.get(`/users?login=${login}`),
  save: user =>
    requests.put('/user', { user })
};

// const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;

const Genres = { all: () => requests.get(`/genres`),}

const Showtimes = { 
  getByMovieId: id => requests.get(`/showtimes?_sort=date,time&movieId=${id}`),
  get: id => requests.get(`/showtimes/${id}?_expand=hall`),
  create: showtime =>
  requests.post('/showtimes', { ...showtime })
}

const Reviews = { 
  getByMovieId: async id =>  {
    const reviews = await requests.get(`/reviews?_sort=date&movieId=${id}`)
    // Получаем информацию о пользователе для каждого отзыва
    return Promise.all(reviews.map(async r => {
      const user = await requests.get(`/users/${r.userId}`);
      return { ...r, userLogin: user.login }; 
    }));
  },
  create: review =>
  requests.post('/reviews', { ...review })
}

const Halls = { all: () => requests.get(`/halls`)}

const Seats = { all: () => requests.get(`/seats?_sort=number`)}

const Booking = { 
   create: booking =>
    requests.post('/bookings', { ...booking}),
  getBookedSeats: showtimeId =>  
    requests.get(`/bookings?showtimeId=${showtimeId}`),
    del: id =>
    requests.del(`/bookings/${id}`)}
    
const Movies = {
  all: () =>
    requests.get(`/movies`),
  get: id =>
    requests.get(`/movies/${id}`),
  create: movie =>
    requests.post('/movies', { ...movie })
};


export default {
  Movies,
  Genres,
  Showtimes,
  Seats,
  Booking,
  Halls,
  Reviews,
  Auth,
  setToken: _token => { token = _token; }
};

