import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/history" onClick={() => setMenuOpen(false)}>History</Link></li>
              <li><Link to="/exercises" onClick={() => setMenuOpen(false)}>Exercises</Link></li>
            </ul>
          </nav>
          <div className="user-info">
            <span className="user-name">Welcome, {userName}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;