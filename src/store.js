import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from '@redux-devtools/extension';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducer from './reducer';

// import { routerMiddleware } from 'react-router-redux'
// import createHistory from 'history/createBrowserHistory';
// import { BrowserRouter } from 'react-router';
// export const history = createHistory();

// // Build the middleware for intercepting and dispatching navigation actions
// const myRouterMiddleware = routerMiddleware(history);

const getMiddleware = () => {
    return applyMiddleware(promiseMiddleware, localStorageMiddleware, process.env.NODE_ENV === 'production'? null: createLogger())
};

export const store = createStore(
  reducer, composeWithDevTools(getMiddleware()));
