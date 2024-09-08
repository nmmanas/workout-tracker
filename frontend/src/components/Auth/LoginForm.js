import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import '../common.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response);
      
      // Check if the response contains a token or success message
      if (response.data.token || response.data.message === 'Logged in successfully') {
        // Store the token if it's returned
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        // Redirect to dashboard
        navigate('/');
      } else {
        setError('Login failed. Unexpected response from server.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="content">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Email" 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Password" 
            className="form-input"
          />
        </div>
        <button type="submit" className="button">Login</button>
        <p style={{textAlign: 'center', marginTop: '1rem'}}>
          Don't have an account? <Link to="/signup" className="link">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;