import superagent from 'superagent';

const API_ROOT = 'http://localhost:3000/api';

const responseBody = res => res.body;

const tokenPlugin = req => {
  const token = localStorage.getItem('jwt-token'); // Извлекаем токен из localStorage
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
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
}

const Auth = {
  login: (login, password) =>
    requests.post(`/users/login`, { login, password }),
  register: (user) =>
    requests.post('/users/registration', { ...user }),
  check: (login) =>
    requests.get(`/users?login=${login}`),
  save: user =>
    requests.put('/user', { user })
};

const Genres = { all: () => requests.get(`/genres`), }

const Showtimes = {
  getByMovieId: id => requests.get(`/showtimes?_sort=date,time&movieId=${id}`),
  get: id => requests.get(`/showtimes/${id}?_expand=hall`),
  create: showtime =>
    requests.post('/showtimes', { ...showtime })
}

const Reviews = {
  getByMovieId: async id => {
    return requests.get(`/reviews?movieId=${id}`)
  },
  create: review =>
    requests.post('/reviews', { ...review })
}

const Halls = { all: () => requests.get(`/halls`) }

const Seats = { all: () => requests.get(`/seats?_sort=number`) }

const Booking = {
  create: booking =>
    requests.post('/bookings', { ...booking }),
  getBookedSeats: showtimeId =>
    requests.get(`/bookings?showtimeId=${showtimeId}`),
  del: id =>
    requests.del(`/bookings/${id}`)
}

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
  Auth
};

