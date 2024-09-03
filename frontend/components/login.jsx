import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../src/assets/css/login.css';
import Navbar from './navbar';
import loginAnimation from '../src/assets/img/loading.gif';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/users/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem('token', response.data.token);

      const userInfoResponse = await axios.get('http://localhost:8000/api/users/info', {
        headers: {
          'Authorization': `Bearer ${response.data.token}`
        }
      });
      localStorage.setItem('user', JSON.stringify(userInfoResponse.data));

      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 3500); // 5 seconds delay
    } catch (error) {
      setLoading(false);
      const message = error.response?.data.message || 'Login failed';
      setErrorMessage(message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2 className="login-title">Log In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="password-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="login-button">Log In</button>
        </form>
        {errorMessage && (
          <p className="error-message" style={{ color: 'red', marginBottom: '-10px', fontSize: '0.8rem' }}>{errorMessage}</p>
        )}
        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <img src={loginAnimation} alt="Loading" />
        </div>
      )}
    </>
  );
}

export default Login;
