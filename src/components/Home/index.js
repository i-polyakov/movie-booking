import React, { useEffect } from 'react';
import agent from '../../agent';
import MovieList from '../MovieList';
import { useDispatch, useSelector } from 'react-redux';
import { HOME_PAGE_LOADED } from '../../constants/actionTypes';


export default function Home() {
  const dispatch = useDispatch();

  const movies = useSelector(state => state.home.movies);
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);

  const onLoad = (payload) => {
    dispatch({ type: HOME_PAGE_LOADED, payload });
  };

  useEffect(() => {
    dispatch(onLoad(agent.Movies.all()));
  }, [dispatch]);

  return (
    <div className="home-page">
      <div className="container page">

        <MovieList movies={movies} user={user} />
      </div>
    </div>
  )
}

