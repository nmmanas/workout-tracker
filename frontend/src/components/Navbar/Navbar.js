import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';  // Import the logo

const Navbar = ({ userName, onLogout, isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src={logo} alt="WTracker Logo" className="logo-image" />
        <span className="user-name">Welcome, {userName}</span>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/history" onClick={() => setMenuOpen(false)}>History</Link>
          <Link to="/exercises" onClick={() => setMenuOpen(false)}>Exercises</Link>
          {isAdmin && (
            <Link to="/users" onClick={() => setMenuOpen(false)}>Users</Link>
          )}
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;