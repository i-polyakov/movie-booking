import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Movie.module.css'; // Импортируем стили
import agent from '../../agent';
import Reviews from './Reviews';
import { MOVIE_PAGE_LOADED } from '../../constants/actionTypes';

const Movie = () => {
    const navigate = useNavigate()

    const { id } = useParams(); // Получаем ID фильма из URL
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const movie = useSelector((state) => state.movie.movie);
    const allHalls = useSelector((state) => state.movie.halls);
    const showtimes = useSelector((state) => state.movie.showtimes.filter(s => allHalls.some(h => h.id === s.hallId)));
    
    const canCreate =  user && user.role === 'admin'
    const genres = useSelector((state) => {
      const currentMovie = state.movie.movie;
      if (!currentMovie) return []  
      return state.movie.genres.filter(g => currentMovie.genresId.includes(g.id))
    });

    useEffect(() => {
        dispatch({type:MOVIE_PAGE_LOADED, payload:  Promise.all([
            agent.Movies.get(id), 
            agent.Showtimes.getByMovieId(id),
            agent.Genres.all(), 
            agent.Seats.all(),
            agent.Halls.all()
        ])}); // Получаем данные о фильме
    }, [dispatch, id]);
    
    const handleShowtimeSelect = (showtime) => {
        navigate(`/movies/${id}/booking/${showtime.id}`);
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
                {canCreate&&(
                    <Link to={`/movies/${id}/new-showtime`} >
                        <button className={styles.button}>Добавить сеанс</button>
                    </Link>
                )}
                {Object.entries(groupedShowtimes).map(([date, halls]) => (
                    <div key={date} className={styles.dateGroup}>
                        <div className={styles.date}>{new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })}</div>
                        <div className={styles.hallList}>
                            {Object.entries(halls).map(([hallId, showtimes]) => (
                                <div key={hallId} className={styles.hallItem}>
                                    <div>{allHalls.find(h=> h.id == hallId).name}</div>
                                    <div className={styles.showtimes}>
                                        {showtimes.map((showtime) => (
                                            <div key={showtime.id} onClick={() => handleShowtimeSelect(showtime)}
                                                 className={`${styles.showtimeItem}`}>
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
            <div>
                {<Reviews movieId={id} user={user}/>}
            </div>
        </div>
    );
};

export default Movie;