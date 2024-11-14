import MoviePreview from './MoviePreview';
// import ListPagination from './ListPagination';
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

  return (
    <div>
      {
        props.movies.map(movie => {
          return (
            <MoviePreview movie={movie} key={movie.id} />
          );
        })
      }

      {/* <ListPagination
        pager={props.pager}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} /> */}
    </div>
  );
};

export default MovieList;
