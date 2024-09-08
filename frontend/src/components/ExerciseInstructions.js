import React from 'react';
import './common.css';

const ExerciseInstructions = ({ exercise }) => {
  return (
    <div className="container">
      <div className="content">
        <h2>{exercise.name}</h2>
        <img src={exercise.imageURL} alt={`${exercise.name} targeted muscles`} style={{maxWidth: '100%', height: 'auto'}} />
        <video src={exercise.videoURL} controls style={{maxWidth: '100%', height: 'auto'}} />
        <p>Targeted Muscles: {exercise.targetedMuscles.join(', ')}</p>
      </div>
    </div>
  );
};

export default ExerciseInstructions;