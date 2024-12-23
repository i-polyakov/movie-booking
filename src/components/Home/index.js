import React, { useEffect } from 'react';
import agent from '../../agent';
import MovieList from '../MovieList';
import { useDispatch, useSelector } from 'react-redux';
import { HOME_PAGE_LOADED } from '../../constants/actionTypes';


export default function Home() {
  const dispatch = useDispatch();

  const movies = useSelector(state => state.home.movies);
  const user = useSelector(state => state.auth.user);
 
  const isAdmin = user && user.role === 'admin'
  const relevantMovies = movies.filter(movie => movie.relevant);
  const irrelevantMovies = movies.filter(movie => !movie.relevant);
  
  useEffect(() => {
    dispatch({ type: HOME_PAGE_LOADED, payload: agent.Movies.all()});
  }, [dispatch]);
  
  return (
    <div className="home-page">
      <div className="container page">

        <MovieList movies={relevantMovies} user={user} />
        {isAdmin&&
          (<div>
            <h2>Скрытые фильмы</h2>
            <MovieList movies={irrelevantMovies} />
          </div>)
        }
      </div>
    </div>
  )
}

