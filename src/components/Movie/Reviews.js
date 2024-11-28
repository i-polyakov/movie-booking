import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Movie.module.css'; 
import agent from '../../agent';
import { CREATE_REVIEW, CREATE_REVIEW_PAGE_LOADED} from '../../constants/actionTypes';

const formatDateTime = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    };
    const date = new Date(dateString);
    return date.toLocaleString(undefined, options); // Форматируем дату и время
};

const Reviews = ({ movieId, user}) => {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.movie.reviews);
    const [newReviw, setNewReview] = useState('');
    const userId = user && user.id
    useEffect(() => {
        dispatch({type:CREATE_REVIEW_PAGE_LOADED, payload: agent.Reviews.getByMovieId(movieId)}); // Загружаем отзывы
    }, [dispatch, movieId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user)
            return alert("Войдите в систему чтобы оставить отзыв.")
        if (newReviw.trim()) {
            const review = {
                userId,
                movieId,
                text: newReviw.trim(),
                date: new Date()
            };
            dispatch({type:CREATE_REVIEW, payload: agent.Reviews.create(review)});
            setNewReview(''); // Очищаем поле ввода
        }
    };

    return (
        <div>
            <h3>Отзывы:</h3>
            <ul className={styles.reviewList}>
                {reviews&&reviews.map((r) => (
                    <li className={styles.review} key={r.id}>
                    <div className={styles.reviewContent}>
                        <span className={styles.reviewUser}>{userId === r.userId ? user.login : r.userLogin}</span>
                        <span className={styles.reviewDate}>{formatDateTime(r.date)}</span>
                    </div>
                    <p className={styles.reviewText}>{r.text}</p>
                </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={newReviw}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Напишите ваш отзыв..."
                />
                <button type="submit">Добавить отзыв</button>
            </form>
        </div>
    );
};

export default Reviews;