import { Link } from 'react-router-dom';
import React from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../constants/actionTypes';
import styles from '../styles/Header.module.css';

const Header = ({ appName, user }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.title}>{appName}</Link>
        <nav className={styles.nav}>
          {user ? (
            <>
              <span className={styles.username}>{user.login}</span>
              <button className={styles.button} onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to='/login' className={styles.button}>Войти</Link>
              <Link to='/register' className={styles.button}>Зарегистрироваться</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
