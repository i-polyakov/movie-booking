import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducer from './reducer';


const getMiddleware = () => {
    return applyMiddleware(promiseMiddleware, localStorageMiddleware, createLogger())
};

// Восстановление состояния из localStorage
const token = localStorage.getItem('jwt-token');
const user = localStorage.getItem('user');
const initialState = {
  auth: {
    token,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token,
  },
};

export const store = createStore(
  reducer, initialState, getMiddleware());
