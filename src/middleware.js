import agent from './agent';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  REGISTER
} from './constants/actionTypes';

const promiseMiddleware = store => next => action => {
  if (action&&isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const skipTracking = action.skipTracking;

    action.payload.then(
      res => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log('RESULT', res);
        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        store.dispatch(action);
      },
      error => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log('ERROR', error);
        action.error = true;
        action.payload = error.response?.body || 'Произошла ошибка. Попробуйте еще раз.';
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload, payload:action.payload, error:action.error });
        }
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

const localStorageMiddleware = store => next => action => {
  if(action){
  if (action.type === REGISTER || action.type === LOGIN) {

    console.log("mid", action.payload);
    if (action.payload.length>0) {
     
      const mockToken = JSON.stringify({ login: action.payload[0].login, role: action.payload[0].role }); // Пример токена
      const encodedToken = btoa(mockToken); // Кодирование токена
      window.localStorage.setItem('jwt', encodedToken);
      window.localStorage.setItem('user', JSON.stringify(action.payload)); // Сохранение информации о пользователе
      agent.setToken(encodedToken);
      action.payload[1] = encodedToken  
    
    }
    else action.error = "Пользователь не найден." 
  } else if (action.type === LOGOUT) {
    window.localStorage.removeItem('jwt');
    window.localStorage.removeItem('user');
    agent.setToken(null);
    
  }

  next(action);
}
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}


export { promiseMiddleware, localStorageMiddleware }
