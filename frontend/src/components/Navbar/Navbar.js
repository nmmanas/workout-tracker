import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <span className="welcome-message">Welcome, {userName}</span>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Dashboard</Link>
        <Link to="/new-workout" onClick={() => setIsOpen(false)}>New Workout</Link>
        <Link to="/history" onClick={() => setIsOpen(false)}>History</Link>
      </div>
    </nav>
  );
};

export default Navbar;