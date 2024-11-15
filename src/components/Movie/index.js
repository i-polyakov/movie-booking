import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Movie.module.css'; // Импортируем стили
import agent from '../../agent';
import { MOVIE_PAGE_LOADED } from '../../constants/actionTypes';


const Movie = () => {
    const navigate = useNavigate()

    const { id } = useParams(); // Получаем ID фильма из URL
    const dispatch = useDispatch();
    
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const movie = useSelector((state) => state.movie.movie);
    const showtimes = useSelector((state) => state.movie.showtimes);
    
    const genres = useSelector((state) => {
      const currentMovie = state.movie.movie;
      if (!currentMovie)
        return []  

      return state.movie.genres.filter(g => currentMovie.genresId.includes(g.id))
    });

    useEffect(() => {
        dispatch({type:MOVIE_PAGE_LOADED, payload:  Promise.all([
            agent.Movies.get(id), 
            agent.Showtimes.getByMovieId(id),
            agent.Genres.all(), 
            agent.Seats.all()
        ])}); // Получаем данные о фильме
    }, [dispatch, id]);
    
    const handleShowtimeSelect = (showtime) => {
        navigate(`/movies/${id}/booking/${showtime.id}`);
        // setSelectedShowtime(showtime);
    };

    const handleBookShowtime = () => {
        // Логика для бронирования сеанса (например, открыть модальное окно)
        alert(`Вы забронировали сеанс на ${selectedShowtime.time}`);
    };

    if (!movie) {
        return <div>Загрузка...</div>;
    }
    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
        const date = showtime.date; // Предполагается, что у вас есть поле date в showtime
        const hallId = showtime.hallId;
    
        if (!acc[date]) {
            acc[date] = {};
        }
        if (!acc[date][hallId]) {
            acc[date][hallId] = [];
        }
        acc[date][hallId].push(showtime);
        
        return acc;
    }, {});
    return (
        <div className={styles.container}>
            <img src={movie.image} alt={movie.title} className={styles.movieImage} />
            <h1>{movie.title}</h1>
            <p><strong>Жанры: </strong>{genres.map(g => g.name).join(', ')}</p>
            <p>
                <strong>Длительность:</strong> {movie.runtime} мин. 
                <strong> Дата выхода:</strong> {new Date(movie.released).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p><strong>Описание:</strong> {movie.plot}</p>
            <h2>Доступные сеансы:</h2>
            
            <div className={styles.showtimeList}>
                {Object.entries(groupedShowtimes).map(([date, halls]) => (
                    <div key={date} className={styles.dateGroup}>
                        <div className={styles.date}>{new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })}</div>
                        <div className={styles.hallList}>
                            {Object.entries(halls).map(([hallId, showtimes]) => (
                                <div key={hallId} className={styles.hallItem}>
                                    <div>{showtimes[0].hall.name}</div>
                                    <div className={styles.showtimes}>
                                        {showtimes.map((showtime) => (
                                            <div key={showtime.id} onClick={() => handleShowtimeSelect(showtime)}
                                                 className={`${styles.showtimeItem} ${selectedShowtime === showtime ? styles.selected : ''}`}>
                                                {showtime.time}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
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