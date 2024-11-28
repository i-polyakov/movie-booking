import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import agent from '../agent';
import { LOGIN } from '../constants/actionTypes';
import styles from '../styles/Login.module.css';
const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const inProgress = useSelector((state) => state.auth.inProgress);
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await agent.Auth.login(login, password);
      console.log('user res', response);
      dispatch({ type: LOGIN, payload: response });
      if (response && response.length > 0)
        navigate('/');
    } catch (error) { alert("Ошибка входа.") }

  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <div className={styles.formGroup}>
        <label htmlFor="username">Логин</label>
        <input className={styles.loginInput}
          type="text"
          id="username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Пароль</label>
        <input className={styles.loginInput}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" disabled={inProgress}>
        {inProgress ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );

}

export default Login;
