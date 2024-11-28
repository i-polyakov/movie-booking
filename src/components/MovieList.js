import { Link } from 'react-router-dom';
import styles from '../styles/MovieList.module.css';
import React from 'react';

const MovieList = props => {
  if (!props.movies) {
    return (
      <div className="movie-preview">Загрузка...</div>
    );
  }

  if (props.movies.length === 0) {
    return (
      <div className="movie-preview">
        К сожалению, по вашему запросу ничего не найдено!
      </div>
    );
  }
  const canCreate = props.user && props.user.role === 'admin'

  return (
   
    <div className={ styles.container }>
      {canCreate&&(
        <Link to={`/movies/new`} className={styles.movieCard}>
            <div className={styles.plusIcon}/> 
        </Link>
      )}
      {
        props.movies.map(movie => {
          return (
            <Link to={`/movies/${movie.id}`} key={movie.id} className={styles.movieCard}>
            <img src={movie.image} alt={movie.title}className={styles.movieImage}/> 
            <div className={styles.movieTitle}>{movie.title}</div>
            
          </Link>
           
          );
        })
      }
    </div>
  );
};

export default MovieList;
