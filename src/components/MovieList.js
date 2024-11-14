import MoviePreview from './MoviePreview';
import { Link } from 'react-router-dom';
import styles from '../styles/MovieList.module.css';
import React from 'react';

const MovieList = props => {
console.log("prop", props);
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
 
  console.log( "style",styles.container);
  return (
   
    <div className={ styles.container }>
      {!props.canCreate&&(
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
