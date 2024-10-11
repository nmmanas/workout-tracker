import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import './NewWorkout.css';

export default function NewWorkout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container">
      {/* Main content */}
      <div className="main-content">
        <h1 className="title">New Workout</h1>
        
        {/* Existing workout form content */}
        <div className="form-container">
          <input
            type="text"
            placeholder="Exercise name"
            className="input"
          />
          <input
            type="number"
            placeholder="Reps"
            className="input"
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            className="input"
          />
          <select className="input">
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
          <button className="add-button">Add Exercise</button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <h2 className="sidebar-title">Exercise Details</h2>
        <p>Select an exercise to view more details.</p>
        <div className="exercise-details">
          <h3>Leg Extension</h3>
          <p>Target Muscle: Quadriceps</p>
          <p>Equipment: Leg Extension Machine</p>
          <p>Instructions:</p>
          <ol>
            <li>Sit on the machine with your back against the backrest.</li>
            <li>Place your legs under the pad.</li>
            <li>Grasp the side bars.</li>
            <li>Lift the weight while exhaling.</li>
            <li>Slowly lower the weight while inhaling.</li>
          </ol>
        </div>
      </div>

      {/* Sidebar toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
}