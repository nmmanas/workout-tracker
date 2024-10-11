import React from 'react';
import { FaBars } from 'react-icons/fa';
import './ExerciseSidebar.css';

const ExerciseSidebar = ({ isOpen, toggleSidebar, currentExercise }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <h2 className="sidebar-title">Exercise Details</h2>
        <p>Select an exercise to view more details.</p>
        {currentExercise && (
          <div className="exercise-details">
            <h3>{currentExercise.name}</h3>
            <p>Target Muscle: {currentExercise.targetMuscle || 'Not specified'}</p>
            <p>Equipment: {currentExercise.equipment || 'Not specified'}</p>
            <p>Instructions:</p>
            <ol>
              {currentExercise.instructions ? (
                currentExercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))
              ) : (
                <li>No instructions available.</li>
              )}
            </ol>
          </div>
        )}
      </div>

      {/* Sidebar toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {/* Overlay for mobile (only visible when sidebar is open on smaller screens) */}
      {isOpen && window.innerWidth < 1024 && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default ExerciseSidebar;