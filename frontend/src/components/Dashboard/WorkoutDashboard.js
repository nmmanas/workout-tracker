import api from '../../api/axiosConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Add this line
import '../common.css';
import './WorkoutDashboard.css';
import WorkoutHistoryList from '../Common/WorkoutHistoryList';

const WorkoutDashboard = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }
        const response = await api.get('/workouts/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Workout history response:', response);
        setWorkoutHistory(response.data);
      } catch (error) {
        console.error('Error fetching workout history:', error);
        setError('Failed to fetch workout history. Please login again.');
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized, removing token and redirecting to login');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchWorkoutHistory();
  }, [navigate]);

  const handleStartWorkout = () => {
    navigate('/new-workout');
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="workout-dashboard">
      <div className="dashboard-header">
        <h2>Workout Dashboard</h2>
        <button onClick={handleStartWorkout} className="start-workout-button">Start Workout</button>
      </div>
      <div className="workout-history">
        <h3>Recent Workouts</h3>
        {workoutHistory.length > 0 ? (
          <WorkoutHistoryList workouts={workoutHistory} limit={5} />
        ) : (
          <p>No workout history available.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutDashboard;