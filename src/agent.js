import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:3000';

const encode = encodeURIComponent;
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


const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const Genres = { all: () =>
  requests.get(`/genres`),}
const Movies = {
  all: () =>
    requests.get(`/movies`),
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/articles?slug=${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/articles/'),//feed?limit=10&offset=0
  get: id =>
    requests.get(`/articles/${id}`),
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: article }),
  create: movie =>
    requests.post('/movies', { ...movie })
};


export default {
  Movies,
  Genres,
  // Auth,
  // Comments,
  // Profile,
  // Tags,
  setToken: _token => { token = _token; },
  getCurrentUser: () => {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      const payload = token.split('.')[1]; // Получаем часть с полезной нагрузкой
      const decodedPayload = JSON.parse(atob(payload)); // Декодируем из Base64
      return decodedPayload; // Здесь будет объект с информацией о пользователе
    }
    return null;
  }

};

