import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Movie.module.css'; // Импортируем стили
import agent from '../../agent';
import Reviews from './Reviews';
import { MOVIE_PAGE_LOADED, UPDATE_MOVIE } from '../../constants/actionTypes';

const dateString  = date_str => date_str.slice(0, 19).replace('T', ' ');

const Movie = () => {
    const navigate = useNavigate()

    const { id } = useParams(); // Получаем ID фильма из URL
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const movie = useSelector((state) => state.movie.movie);
    const showtimes = useSelector((state) => state.movie.showtimes)
    
    const isRelevant = movie && movie.relevant
    const canCreate =  user && user.role === 'admin'

    useEffect(() => {
        dispatch({type:MOVIE_PAGE_LOADED, payload:  Promise.all([
            agent.Movies.get(id), 
            agent.Showtimes.getByMovieId(id),
            agent.Seats.all()
        ])}); // Получаем данные о фильме
    }, [dispatch, id]);
    
    const handleShowtimeSelect = (showtime) => {
        if(new Date(dateString(showtime.show_date)) >= new Date())
            navigate(`/movies/${id}/booking/${showtime.id}`);
    };

    if (!movie) {
        return <div>Загрузка...</div>;
    }
    const genreNames = movie.Genres.map(genre => genre.name.toLowerCase()).join(', ')
    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
        const date = showtime.show_date.split('T')[0];
        const hallId = showtime.hall_id;
        if (!acc[date]) {
            acc[date] = {};
        }
        if (!acc[date][hallId]) {
            acc[date][hallId] = [];
        }
        acc[date][hallId].push(showtime);
        
        return acc;
    }, {});

    const handleRelevant = async () => {
        const updatedMovie = await agent.Movies.setRelevant(id, !isRelevant)
        dispatch({ type: UPDATE_MOVIE, payload: updatedMovie},);
      };

    return (
        <div className={styles.container}>
            <img src={movie.image_url} alt={movie.title} className={styles.movieImage} />
            <h1>{movie.title }</h1>
            <p><strong>Оценка: </strong>{movie.reviewCount? `${movie.averageRating} (${movie.reviewCount})`:'нет оценок'}</p>
            <p><strong>Жанры: </strong>{genreNames}</p>
            <p>
                <strong>Длительность:</strong> {movie.runtime} мин. 
                <strong> Дата выхода:</strong> {new Date(movie.released).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p><strong>Описание:</strong> {movie.plot}</p>
            <h2>Доступные сеансы:</h2>
            
            <div className={styles.showtimeList}>
                {canCreate&&(
                    <div>
                        <Link to={`/movies/${id}/new-showtime`} >
                            <button className={styles.button}>Добавить сеанс</button>
                        </Link>
                        <button className={styles.button}  onClick={handleRelevant}>{isRelevant?'Скрыть фильм':'Показать фильм'}</button>
                    </div>
                )}
                {Object.entries(groupedShowtimes).map(([date, halls]) => (
                    <div key={date} className={styles.dateGroup}>
                        <div className={styles.date}>{new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })}</div>
                        <div className={styles.hallList}>
                            {Object.entries(halls).map(([hallId, showtimes]) => (
                                <div key={hallId} className={`${styles.hallItem} `}>
                                    <div>{showtimes[0].Hall&&showtimes[0].Hall.name}</div>
                                    <div className={styles.scrollable}>
                                        <div className={`${styles.showtimes}`}>
                                            {showtimes.map((showtime) => (
                                                <div key={showtime.id} onClick={() => handleShowtimeSelect(showtime)}
                                                    className={`${styles.showtimeItem} ${new Date(dateString(showtime.show_date)) < new Date() ? styles.disabled:''}`}>
                                                    {dateString(showtime.show_date).slice(-8, -3)}
                                                </div>
                                            ))}
                                        </div>
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