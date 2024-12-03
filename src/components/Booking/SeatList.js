import React, { useEffect, useState } from 'react';
import styles from './SeatList.module.css'; // Импортируйте стили как модули
import { useDispatch, useSelector } from 'react-redux';
import { useParams} from 'react-router-dom';
import { SELECT_SEAT_PAGE_LOADED, CREATE_BOOKINGS, DELETE_BOOKING} from '../../constants/actionTypes';
import agent from '../../agent';

const SeatList = () => {
    const { id, showtimeId} = useParams(); // Получаем ID фильма из URL
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookingCounter, setBookingCounter] = useState(0);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch({type:SELECT_SEAT_PAGE_LOADED, payload:  Promise.all([
            agent.Movies.get(id), 
            agent.Showtimes.get(showtimeId),
            agent.Seats.all(),
            agent.Booking.getBookedSeats(showtimeId)
        ])}); // Получаем данные о фильме
    }, [dispatch, id, bookingCounter]);
    const { error, errorMessage } = useSelector(state => ({
        error: state.common.error,
        errorMessage: state.common.errorMessage
    }));

    const showtime = useSelector((state) => !error&&state.movie.showtime);
    const seats = useSelector((state) => !error&&state.movie.seats.filter(s => showtime !== undefined &&s.hall_id == showtime.hall_id));
    const bookedSeats = useSelector((state) => !error&&state.movie.bookedSeats);
    const user = useSelector(state => state.auth.user);
    const userId = user&&user.id; // ID текущего пользователя

    if (error) 
        return <div>Произошла ошибка. Попробуйте еще раз</div>;
    
    if (!showtime|| showtime.movie_id != id){
        return (  
            <div> К сожалению, доступных сеансов нет!</div>
            )
        }
        
    const toggleSeatSelection = (seatId) => {
        setSelectedSeats(prevSelectedSeats =>
            prevSelectedSeats.includes(seatId)
                ? prevSelectedSeats.filter(id => id !== seatId) // Убираем, если уже выбрано
                : [...prevSelectedSeats, seatId] // Добавляем, если не выбрано
        );
    };

    const handleBooking = async () => {
        try {
            if (!user)
                return alert("Войдите в систему для бронирования.")
                
            const bookings = await Promise.all(selectedSeats.map( async s => {
                const booking = {
                    showtimeId,
                    seatId: s
                }
                return await agent.Booking.create(booking)
            }));
            dispatch({ type: CREATE_BOOKINGS, payload: bookings });
            setSelectedSeats([])
            setBookingCounter(prev => prev + 1)
            alert(`Вы забронировали места.`);
        } catch (error) {
            console.error('Ошибка при бронировании:', error);
            alert(error.response.body.message);
        }
       
    };

    const handleCancelBooking = async (booking) => {
        const res = window.confirm("Отменить бронь?")
        if (res)
            try {
                await agent.Booking.del(booking.id)
                dispatch({ type: DELETE_BOOKING, payload: booking.id});
                setBookingCounter(prev => prev + 1); // Увеличиваем счетчик для обновления
            } catch (error) {
                console.error('Ошибка при отмене бронирования:', error);
                alert('Не удалось отменить бронь. Попробуйте снова.');
            }
    };

    // Группировка мест по рядам
    const groupedSeats = Object.groupBy(seats, seat => seat.row);

    return (
        <div className={styles.seatSelection}>
            <h2>Выберите места</h2>
            <p>Сеанс: {new Date(showtime.show_date).toLocaleString()}</p>
            {Object.entries(groupedSeats).map(([row, seats]) => (
                <div key={row} className={styles.row}>
                    <span className={styles.rowLabel}>Ряд {row}</span>
                    {seats.map(seat => (
                        <button
                            key={seat.id}
                            className={`
                                ${styles.seatButton} 
                                ${bookedSeats.some(b => b.seat_id == seat.id && userId == b.user_id) ? styles.userBooked:''}
                                ${selectedSeats.includes(seat.id) ? styles.selected : ''}`
                            }
                            disabled={bookedSeats.some(b => b.seat_id == seat.id && userId != b.user_id)}
                            onClick={() => { 
                                const booking = bookedSeats.find(b => b.seat_id == seat.id && userId == b.user_id)  
                                booking ? handleCancelBooking(booking): toggleSeatSelection(seat.id)
                            }}>
                            {seat.number}
                        </button>
                    ))}
                </div>
            ))}
            
            <div>
                <h3>Выбранные места:</h3>
                {seats.filter(s => selectedSeats.includes(s.id)).map((seat)=>(<div key={seat.id}>Ряд {seat.row}, место {seat.number}</div>))}
              
            </div>
            <button onClick={handleBooking} className={styles.confirmButton} disabled={selectedSeats.length==0}>
                Забронировать
            </button>
        </div>
    );
};

export default SeatList;