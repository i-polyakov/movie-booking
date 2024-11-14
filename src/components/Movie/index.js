import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Movie.module.css'; // Импортируем стили
import agent from '../../agent';
import { MOVIE_PAGE_LOADED } from '../../constants/actionTypes';

const Movie = () => {
    const { id } = useParams(); // Получаем ID фильма из URL
    const dispatch = useDispatch();
    
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const movie = useSelector((state) => state.movie.movie);
    const showtimes = useSelector((state) => state.movie.showtimes);
    
    const genres = useSelector((state) => {
      const currentMovie = state.movie.movie;
      if (!currentMovie)
        return []  
      console.log(currentMovie)
      return  state.movie.genres.filter(g => currentMovie.genresId.includes(g.id))

    });

    useEffect(() => {
        dispatch({type:MOVIE_PAGE_LOADED, payload:  Promise.all([
            agent.Movies.get(id), 
            agent.Showtimes.getByMovieId(id),
            agent.Genres.all(), 
        ])}); // Получаем данные о фильме
    }, [dispatch, id]);

    const handleShowtimeSelect = (showtime) => {
        setSelectedShowtime(showtime);
    };

    const handleBookShowtime = () => {
        // Логика для бронирования сеанса (например, открыть модальное окно)
        alert(`Вы забронировали сеанс на ${selectedShowtime.time}`);
    };

    if (!movie) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>{movie.title}</h1>
            <img src={movie.image} alt={movie.title} className={styles.movieImage} />
            <p><strong>Описание:</strong> {movie.plot}</p>
            <p><strong>Дата выхода:</strong> {movie.released}</p>
            <p><strong>Длительность:</strong> {movie.runtime} мин.</p>
            
            <h2>Доступные сеансы:</h2>
            <div className={styles.showtimeList}>
                {showtimes.map((showtime) => (
                    <div
                        key={showtime.id}
                        className={`${styles.showtimeItem} ${selectedShowtime === showtime ? styles.selected : ''}`}
                        onClick={() => handleShowtimeSelect(showtime)}
                    >
                        {showtime.time}
                    </div>
                ))}
            </div>

            {selectedShowtime && (
                <button onClick={handleBookShowtime} className={styles.bookButton}>
                    Забронировать сеанс
                </button>
            )}
        </div>
    );
};

export default Movie;