import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import './WorkoutHistory.css';

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get('/workouts/history');
        console.log('Fetched workouts:', response.data);
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workout history:', error);
        setError('Failed to fetch workout history. Please try again.');
      }
    };
    fetchWorkouts();
  }, []);

  const difficultyEmojis = {
    too_easy: '😊',
    normal: '😐',
    too_hard: '😓'
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="workout-history">
      <h2>Workout History</h2>
      {workouts.map((workout, index) => (
        <div key={index} className="workout-item">
          <h3>{new Date(workout.date).toLocaleDateString()}</h3>
          {workout.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="exercise-entry">
              <strong>{exercise.name}</strong>
              {exercise.sets.map((set, setIndex) => (
                <p key={setIndex}>
                  Set {setIndex + 1}: {set.reps} reps @ {set.weight} kg
                  {set.difficulty && (
                    <span className="difficulty-indicator" title={set.difficulty}>
                      {difficultyEmojis[set.difficulty] || set.difficulty}
                    </span>
                  )}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WorkoutHistory;