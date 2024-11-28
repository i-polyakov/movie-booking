import Header from './Header';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../constants/actionTypes';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import Movie from '../components/Movie';
import Login from '../components/Login';
import Register from '../components/Register';
import SeatList from '../components/Booking/SeatList';
import { push } from 'react-router-redux';
import CreateMovie from './CreateMovie';
import CreateShowtime from './CreateShowtime';

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


export default function App() {
  const dispatch = useDispatch();

  // Используем useSelector для получения состояния из Redux
  const appLoaded = useSelector(state => state.common.appLoaded);
  const appName = useSelector(state => state.common.appName);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch({ type: APP_LOAD, payload: null, skipTracking: true });
  }, [dispatch]);


  if (appLoaded) {
    return (
      <div>
        <Header appName={appName} user={currentUser} />
        <Routes>
          <Route exact path="/*" element={<Home/>} />
          <Route exact path="/movies/new" element={<CreateMovie />} />
          <Route exact path="/movies/:id" element={<Movie />} />
          <Route exact path="/movies/:id/new-showtime" element={<CreateShowtime />} />
          <Route exact path="/movies/:id/booking/:showtimeId" element={<SeatList />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
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

