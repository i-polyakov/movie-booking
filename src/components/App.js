import agent from '../agent';
import Header from './Header';
import React, { useEffect }  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import { store } from '../store';
import { push } from 'react-router-redux';

// const mapStateToProps = state => {
//   return {
//     appLoaded: state.common.appLoaded,
//     appName: state.common.appName,
//     currentUser: state.common.currentUser,
//     redirectTo: state.common.redirectTo
//   }};

// const mapDispatchToProps = dispatch => ({
//   onLoad: (payload, token) =>
//     dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
//   onRedirect: () =>
//     dispatch({ type: REDIRECT })
// });


export default function App (){
  const dispatch = useDispatch();

  // Используем useSelector для получения состояния из Redux
  const appLoaded = useSelector(state => state.common.appLoaded);
  const appName = useSelector(state => state.common.appName);
  const currentUser = useSelector(state => state.common.currentUser);
  const redirectTo = useSelector(state => state.common.redirectTo);

  useEffect(() => {
    // Эмулируем componentWillMount
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }
    dispatch({ type: APP_LOAD, payload: token ? agent.Auth.current() : null, token, skipTracking: true });
  }, [dispatch]); // В зависимости добавляем dispatch

  useEffect(() => {
    // Эмулируем componentWillReceiveProps
    if (redirectTo) {
      dispatch(push(redirectTo)); // Используем dispatch для навигации
      dispatch({ type: REDIRECT });
    }
  }, [redirectTo, dispatch]); // Этот эффект будет выполняться, когда изменится redirectTo


    if (appLoaded) {
      return (
        <div>
          <Header
            appName={appName}
            currentUser={currentUser} />
            <Routes>
            <Route exact path="/*" element={<Home/>}/>
            {/* <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/editor/:slug" component={Editor} />
            <Route path="/editor" component={Editor} />
            <Route path="/articles/:id" component={Article} />
            <Route path="/settings" component={Settings} />
            <Route path="/@:username/favorites" component={ProfileFavorites} />
            <Route path="/@:username" component={Profile} /> */}
            </Routes>
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={appName}
          currentUser={currentUser} />
      </div>
    );
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

