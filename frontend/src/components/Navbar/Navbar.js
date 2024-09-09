import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userName, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            <li><Link to="/history" onClick={() => setMenuOpen(false)}>History</Link></li>
            <li><Link to="/exercises" onClick={() => setMenuOpen(false)}>Exercises</Link></li>
          </ul>
        </div>
        <div className="user-info">
          <span className="user-name">Welcome, {userName}</span>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;