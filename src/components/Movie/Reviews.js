import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Movie.module.css';
import agent from '../../agent';
import { CREATE_REVIEW, CREATE_REVIEW_PAGE_LOADED } from '../../constants/actionTypes';

const formatDateTime = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    };
    const date = new Date(dateString.slice(0, 19).replace('T', ' '));
    return date.toLocaleString(undefined, options); // Форматируем дату и время
};

const Reviews = ({ movieId, user }) => {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.movie.reviews);
    const [newReviw, setNewReview] = useState('');
    const [rating, setRating] = useState(''); // Состояние для хранения оценки
    const userId = user && user.id
    useEffect(() => {
        dispatch({ type: CREATE_REVIEW_PAGE_LOADED, payload: agent.Reviews.getByMovieId(movieId) }); // Загружаем отзывы
    }, [dispatch, movieId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user)
            return alert("Войдите в систему чтобы оставить отзыв.")
        if (newReviw.trim()) {
            const review = {
                movieId,
                text: newReviw.trim(),
                rate: rating === '' ? null : rating
            };
            const createdReview = await agent.Reviews.create(review)
            dispatch({ type: CREATE_REVIEW, payload: createdReview });
            setNewReview(''); // Очищаем поле ввода
        }
    };
    return (
        <div>
            <h3>Отзывы:</h3>
            <ul className={styles.reviewList}>
                {reviews && reviews.map((r) => (
                    <li className={styles.review} key={r.id}>
                        <div className={styles.reviewContent}>
                            <span className={styles.reviewUser}>{userId === r.user_id ? user.login : r.User.login}</span>
                            <span className={styles.reviewDate}>{r.rate? `оценка: ${r.rate}, `:''}{formatDateTime(r.create_at)}</span>
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
                <div className={styles.ratingSelect}>
                    <span>Оцените фильм:</span>
                    <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}                    >
                        <option value=''>Не оценивать</option>
                        {[...Array(10)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Добавить отзыв</button>
            </form>
        </div>
    );
};

export default Reviews;