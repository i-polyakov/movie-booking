import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from '@redux-devtools/extension';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducer from './reducer';


const getMiddleware = () => {
    return applyMiddleware(promiseMiddleware, localStorageMiddleware, process.env.NODE_ENV === 'production'? null: createLogger())
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
  reducer,initialState, composeWithDevTools(getMiddleware()));
