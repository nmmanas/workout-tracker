import React from 'react';
import '../common.css';

const WorkoutHistoryList = ({ workouts, limit }) => {
  const displayWorkouts = limit ? workouts.slice(0, limit) : workouts;

  const difficultyEmojis = {
    too_easy: '😊',
    normal: '😐',
    too_hard: '😓'
  };

  return (
    <div className="history-list">
      {displayWorkouts.map((workout, index) => (
        <div key={index} className="history-item">
          <h4>Workout on {new Date(workout.date).toLocaleDateString()}</h4>
          {workout.isDraft && <span className="draft-label">Draft Workout</span>}
          {workout.exercises.map((exercise, idx) => (
            <div key={idx} className="exercise-entry">
              <strong>{exercise.name}</strong>
              {exercise.sets.map((set, sIdx) => (
                <p key={sIdx}>
                  Set {sIdx + 1}: {set.reps} reps @ {set.weight} kg
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

export default WorkoutHistoryList;