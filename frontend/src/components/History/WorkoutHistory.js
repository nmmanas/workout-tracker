import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import '../common.css';
import './WorkoutHistory.css';
import WorkoutHistoryList from '../Common/WorkoutHistoryList';
import { FaSpinner } from 'react-icons/fa';

const WorkoutHistory = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/workouts/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setWorkoutHistory(response.data);
      } catch (error) {
        console.error('Error fetching workout history:', error);
        setError('Failed to fetch workout history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredWorkouts = workoutHistory.filter(workout => {
    const dateMatch = new Date(workout.date).toLocaleDateString().includes(filter);
    const exerciseMatch = workout.exercises.some(exercise => exercise.name.toLowerCase().includes(filter.toLowerCase()));
    return dateMatch || exerciseMatch;
  });

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="workout-history">
      <h2>Workout History</h2>
      <input 
        type="text" 
        placeholder="Filter by date or exercise" 
        value={filter} 
        onChange={handleFilterChange}
        className="form-input filter-input"
      />
      {isLoading ? (
        <div className="loading-spinner"><FaSpinner className="spinner" /></div>
      ) : workoutHistory.length > 0 ? (
        <WorkoutHistoryList workouts={filteredWorkouts.map(workout => ({
          ...workout,
          isDraft: workout.isDraft || false
        }))} />
      ) : (
        <p>No workout history available.</p>
      )}
    </div>
  );
};

export default WorkoutHistory;