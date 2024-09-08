import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';  // Add this line
import api from '../../api/axiosConfig';
import '../common.css';
import './NewWorkout.css';

const NewWorkout = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [error, setError] = useState(null);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState([]);
  const repsInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await api.get('/exercises', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setError('Failed to fetch exercises. Please try again.');
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchExercises();
  }, [navigate]);

  const handleExerciseSelect = (e) => {
    const exerciseId = e.target.value;
    const selected = exercises.find(ex => ex._id === exerciseId);
    setSelectedExercise(exerciseId);
    if (selected) {
      setCurrentExercise(selected);
      setWeight(selected.lastWeight ? selected.lastWeight.toString() : '');
    }
  };

  const handleAddSet = () => {
    if (reps && weight) {
      setSets([...sets, { reps: parseInt(reps), weight: parseFloat(weight) }]);
      setReps('');
      setWeight(currentExercise.lastWeight ? currentExercise.lastWeight.toString() : '');
      
      // Set focus on the reps input field
      if (repsInputRef.current) {
        repsInputRef.current.focus();
      }
    }
  };

  const handleCompleteExercise = () => {
    if (sets.length > 0) {
      setCompletedExercises([...completedExercises, { ...currentExercise, sets }]);
      setCurrentExercise(null);
      setSelectedExercise('');
      setSets([]);
    }
  };

  const handleFinishWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const workoutData = {
        date: new Date(),
        exercises: completedExercises
      };

      await api.post('/workouts', workoutData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/');
    } catch (error) {
      console.error('Error saving workout:', error);
      setError('Failed to save workout. Please try again.');
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="new-workout">
      <h2>New Workout</h2>
      {!currentExercise && (
        <div className="exercise-select">
          <select value={selectedExercise} onChange={handleExerciseSelect}>
            <option value="">Select an exercise</option>
            {exercises.map(exercise => (
              <option key={exercise._id} value={exercise._id}>{exercise.name}</option>
            ))}
          </select>
        </div>
      )}
      {currentExercise && (
        <div className="current-exercise">
          <h3>{currentExercise.name}</h3>
          <div className="set-inputs">
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Reps"
              className="reps-input"
              ref={repsInputRef}
            />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight (kg)"
              className="weight-input"
            />
            <button onClick={handleAddSet} className="add-set-button">Add Set</button>
          </div>
          {sets.length > 0 && (
            <div className="sets-list">
              <h4>Sets:</h4>
              {sets.map((set, index) => (
                <p key={index}>Set {index + 1}: {set.reps} reps @ {set.weight} kg</p>
              ))}
            </div>
          )}
          <button onClick={handleCompleteExercise} className="complete-exercise-button">Complete Exercise</button>
        </div>
      )}
      <div className="completed-exercises">
        <h3>Completed Exercises</h3>
        {completedExercises.map((exercise, index) => (
          <div key={index} className="completed-exercise-item">
            <h4>{exercise.name}</h4>
            {exercise.sets.map((set, setIndex) => (
              <p key={setIndex}>Set {setIndex + 1}: {set.reps} reps @ {set.weight} kg</p>
            ))}
          </div>
        ))}
      </div>
      {completedExercises.length > 0 && (
        <button onClick={handleFinishWorkout} className="finish-workout-button">Finish Workout</button>
      )}
    </div>
  );
};

export default NewWorkout;