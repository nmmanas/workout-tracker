import React from 'react';
import '../common.css';

const WorkoutHistoryList = ({ workouts, limit }) => {
  const displayWorkouts = limit ? workouts.slice(0, limit) : workouts;

  return (
    <div className="history-list">
      {displayWorkouts.map((workout, index) => (
        <div key={index} className="history-item">
          <h4>Workout on {new Date(workout.date).toLocaleDateString()}</h4>
          {workout.exercises.map((exercise, idx) => (
            <div key={idx} className="exercise-entry">
              <strong>{exercise.name}</strong>
              {exercise.sets.map((set, sIdx) => (
                <p key={sIdx}>Set {set.setNumber}: {set.reps} reps @ {set.weight} kg</p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WorkoutHistoryList;