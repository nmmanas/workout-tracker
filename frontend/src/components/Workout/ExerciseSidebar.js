import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import './ExerciseSidebar.css';
import WorkoutProgressChart from '../Progress/WorkoutProgressChart';

const ExerciseSidebar = ({ isOpen, toggleSidebar, currentExercise }) => {
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    // Force re-render of WorkoutProgressChart when currentExercise changes
    setChartKey(prevKey => prevKey + 1);
  }, [currentExercise]);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <h2 className="sidebar-title">Exercise Details</h2>
        {currentExercise ? (
          <>
            <div className="exercise-details">
              <h3>{currentExercise.name}</h3>
            </div>
            <div className="exercise-progress">
              <h4>Exercise Progress</h4>
              <WorkoutProgressChart 
                key={chartKey} 
                initialExercise={currentExercise.name} 
              />
            </div>
          </>
        ) : (
          <p>Select an exercise to view more details.</p>
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
