import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../common.css';
import './WorkoutHistory.css';
import WorkoutHistoryList from '../Common/WorkoutHistoryList';

const WorkoutHistory = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/workouts/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setWorkoutHistory(response.data);
      } catch (error) {
        console.error('Error fetching workout history:', error);
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
      <WorkoutHistoryList workouts={filteredWorkouts.map(workout => ({
        ...workout,
        isDraft: workout.isDraft || false // Ensure isDraft is set
      }))} />
    </div>
  );
};

export default WorkoutHistory;