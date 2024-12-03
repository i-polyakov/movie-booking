import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { CREATE_SHOWTIME_PAGE_LOADED, CREATE_SHOWTIME } from '../constants/actionTypes';
import styles from '../styles/CreateShowtime.module.css';
import agent from '../agent';

const CreateShowtime = () => {
    const { id } = useParams(); // Получаем ID фильма из URL
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedHallId, setSelectedHallId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    
    const user = useSelector(state => state.auth.user);
    const movie = useSelector((state) => state.movie.movie);
    const allHalls = useSelector((state) => state.movie.halls);
    const showtimes = useSelector((state) =>{
        return state.movie.showtimes.filter(s => allHalls.some(h => h.id === s.hallId));
    });

    useEffect(() => {
        if (allHalls && allHalls.length > 0) {
            setSelectedHallId(allHalls[0].id); // Зал по умолчанию
        }
        
    }, [allHalls]); 

    useEffect(() => {
       
        dispatch({type:CREATE_SHOWTIME_PAGE_LOADED, payload:  Promise.all([
            agent.Movies.get(id), 
            agent.Showtimes.getByMovieId(id),
            agent.Halls.all()
        ])}); // Получаем данные 
    }, [dispatch, id]);

    if (!user || user.role !== 'admin')
        return navigate("/") 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(date).toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10))
            return alert('Не удалось создать сеанс. Неправильная дата.');
        
        if (showtimes.some(s => s.hall_id == selectedHallId && s.date == date && s.time == time))
            return alert('Это время занято.');
        
        const newShowtime = {
            hallId: selectedHallId,
            movieId: id,
            show_date: `${date} ${time}`
        };
        try {
            const createdShowtime = await agent.Showtimes.create(newShowtime)
            dispatch({ type: CREATE_SHOWTIME, payload: createdShowtime});
            const formatedDate = new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
            alert(`Вы добавили сеанс на ${formatedDate} ${time}`)
           // navigate(`/movies/${id}`);
        } catch (error) {
            console.error('Ошибка при создании сеанса:', error);
            alert(error.response.body.message);
        }
    
    };


    return (
        <div className={styles.container}>
            <h3>Фильм </h3>
            <p className={styles.movieTitle}>{movie&&movie.title}</p>
            <h2>Cеанс</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.group}>
                    <label>Зал: </label>
                    <select value={selectedHallId} onChange={(e) => setSelectedHallId(e.target.value)}>
                        {allHalls&&allHalls.map(hall => (
                            <option key={hall.id} value={hall.id}>{hall.name}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.group}>
                    <label>Дата:</label>
                    <input type="date" value={date} min={ new Date().toISOString().split('T')[0]} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className={styles.group}>
                    <label>Время:</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <button type="submit">Создать сеанс</button>
            </form>
        </div>
    );
};

export default CreateShowtime;