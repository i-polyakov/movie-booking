import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import agent from '../agent';
import { REGISTER, LOGIN_FAIL } from '../constants/actionTypes';
import styles from '../styles/Login.module.css';
const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const inProgress = useSelector((state) => state.auth.inProgress);
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // Проверка на совпадение паролей
      if (password !== confirmPassword) {
        dispatch({ type: LOGIN_FAIL, payload: 'Пароли не совпадают' });
        return;
      }
      const newUser = { login, password, role: "user" }
      const user = await agent.Auth.check(login);
      if (user && user.length > 0) {
        dispatch({ type: LOGIN_FAIL, payload: 'Логин занят' });
        return;
      }

      const res = await agent.Auth.register(newUser);
      dispatch({ type: REGISTER, payload: [res] });
      if (res && res.id)
        navigate('/');
    } catch (error) {
      console.log(error);
      alert('Ошибка регистрации')
    }

  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
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
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Подтверждение пароля</label>
        <input
          className={styles.loginInput}
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" disabled={inProgress}>
        {inProgress ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );

}

export default Register;
