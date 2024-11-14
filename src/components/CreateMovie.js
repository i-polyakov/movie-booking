import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { CREATE_MOVIE_PAGE_LOADED, CREATE_MOVIE_PAGE_UNLOADED, CREATE_MOVIE } from '../constants/actionTypes';
import agent from '../agent';
import styles from '../styles/CreateMovie.module.css';

const CreateMovie = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [released, setReleased] = useState('');
    const [runtime, setRuntime] = useState('');
    const [image, setImage] = useState('https://i.pinimg.com/736x/75/3b/db/753bdb99878721343ca0ece0a1a05cb9.jpg');
    const [plot, setPlot] = useState('');
    const [genresId, setGenresID] = useState([]);

    const genres = useSelector((state) => state.movie.genres);

    useEffect(() => {
        dispatch({ type: CREATE_MOVIE_PAGE_LOADED, payload: agent.Genres.all() });
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMovie = {
            title,
            released,
            runtime,
            image,
            plot,
            genresId,
        };
        try {
            const createdMovie = await agent.Movies.create(newMovie)
            dispatch({ type: CREATE_MOVIE, payload: createdMovie });
            console.log(createdMovie);
            navigate(`/movies/${createdMovie.id}`);
        } catch (error) {
            console.error('Ошибка при создании фильма:', error);
            alert('Не удалось создать фильм. Попробуйте снова.');
        }
        setTitle('');
        setReleased('');
        setRuntime('');
        setImage('');
        setPlot('');
        setGenresID([]);
    };

    const handleGenreChange = (genreId) => {
        if (genresId.includes(genreId)) {
            setGenresID(genresId.filter((id) => id !== genreId));
        } else {
            setGenresID([...genresId, genreId]);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Создать новый фильм</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Название:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Дата выхода:</label>
                    <input type="date" value={released} onChange={(e) => setReleased(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Длительность в минутах:</label>
                    <input type="number" value={runtime} onChange={(e) => setRuntime(e.target.value)} required />
                    <label>
                         
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label>Ссылка на изображение:</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Описание:</label>
                    <textarea value={plot} onChange={(e) => setPlot(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Жанры:</label>
                    <div className={styles.checkboxGroup}>
                        {genres.map((genre) => (
                            <div key={genre.id}>
                                <input type="checkbox"
                                    checked={genresId.includes(genre.id)}
                                    onChange={() => handleGenreChange(genre.id)}
                                    className={styles.checkbox} />
                                {genre.name}
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit">Создать фильм</button>
            </form>
        </div>
    );
};

export default CreateMovie;