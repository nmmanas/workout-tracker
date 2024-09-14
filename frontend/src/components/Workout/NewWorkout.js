import React, { useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  const [lastExerciseData, setLastExerciseData] = useState({ reps: '', weight: '' });
  const [lastAddedSet, setLastAddedSet] = useState(null);
  const [suggestedExercises, setSuggestedExercises] = useState([]);

  const handleWeightChange = (amount) => {
    setWeight(prevWeight => {
      const newWeight = Math.max(0, parseFloat(prevWeight || 0) + amount);
      return newWeight.toFixed(1); // Ensures we always have one decimal place
    });
  };

  const handleRepsChange = (amount) => {
    setReps(prevReps => {
      const newReps = Math.max(0, parseInt(prevReps || 0) + amount);
      return newReps.toString();
    });
  };

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

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await api.get('/workouts/draft');
        if (response.data) {
          setCompletedExercises(response.data.exercises);
          // Set other state variables as needed
        }
      } catch (error) {
        console.error('Error fetching draft:', error);
      }
    };
    fetchDraft();
  }, []);

  useEffect(() => {
    const saveDraft = async () => {
      if (completedExercises.length > 0) {
        try {
          await api.post('/workouts/draft', {
            date: new Date(),
            exercises: completedExercises
          });
        } catch (error) {
          console.error('Error saving draft:', error);
        }
      }
    };
    saveDraft();
  }, [completedExercises]);

  useEffect(() => {
    const fetchSuggestedExercises = async () => {
      try {
        const response = await api.get('/workouts/suggested-next');
        console.log('Fetched suggested exercises:', response.data);
        setSuggestedExercises(response.data);
        if (response.data.length > 0) {
          const firstExercise = response.data[0];
          setCurrentExercise(firstExercise);
          setSelectedExercise(firstExercise._id);
          fetchLastExerciseData(firstExercise.name); // Fetch last data for the first exercise
        }
      } catch (error) {
        console.error('Error fetching suggested exercises:', error);
        setError('Failed to fetch suggested exercises. Please try again.');
      }
    };
    fetchSuggestedExercises();
  }, []);

  const handleExerciseSelect = async (e) => {
    const exerciseId = e.target.value;
    const selected = exercises.find(ex => ex._id === exerciseId);
    setSelectedExercise(exerciseId);
    if (selected) {
      setCurrentExercise(selected);
      try {
        const response = await api.get(`/exercises/last-data/${selected.name}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Last exercise data response:', response.data);
        setLastExerciseData(response.data);
        
        // Set reps and weight based on last exercise data
        const newReps = response.data.reps !== null ? response.data.reps.toString() : '10';
        const newWeight = response.data.weight !== null ? response.data.weight.toString() : '0';
        
        console.log('Setting new reps:', newReps);
        console.log('Setting new weight:', newWeight);
        
        setReps(newReps);
        setWeight(newWeight);
        setLastAddedSet(null); // Reset lastAddedSet when selecting a new exercise
      } catch (error) {
        console.error('Error fetching last exercise data:', error);
        // If there's no previous data, set default values
        console.log('Setting default values');
        setLastExerciseData({ reps: '10', weight: '0' });
        setReps('10');
        setWeight('0');
      }
    } else {
      setCurrentExercise(null);
      setSets([]);
      setLastExerciseData({ reps: '', weight: '' });
      setLastAddedSet(null);
    }
  };

  const handleAddSet = () => {
    if (reps && weight) {
      const newSet = { reps: parseInt(reps), weight: parseFloat(weight) };
      setSets([...sets, newSet]);
      setLastAddedSet(newSet);
      
      // Autofill with the set just added
      setReps(newSet.reps.toString());
      setWeight(newSet.weight.toString());
      
      // Remove the following lines:
      // if (repsInputRef.current) {
      //   repsInputRef.current.focus();
      // }
    }
  };

  useEffect(() => {
    if (currentExercise) {
      // Autofill with last exercise data when selecting a new exercise
      console.log('Updating reps and weight from lastExerciseData:', lastExerciseData);
      const newReps = lastExerciseData.reps ? lastExerciseData.reps.toString() : '10';
      const newWeight = lastExerciseData.weight !== null && lastExerciseData.weight !== undefined ? lastExerciseData.weight.toString() : '0';
      setReps(newReps);
      setWeight(newWeight);
    } else if (lastAddedSet) {
      // Autofill with the last added set for subsequent sets
      console.log('Updating reps and weight from lastAddedSet:', lastAddedSet);
      setReps(lastAddedSet.reps.toString());
      setWeight(lastAddedSet.weight.toString());
    }
  }, [currentExercise, lastAddedSet, lastExerciseData]);

  const handleCompleteExercise = () => {
    if (sets.length > 0) {
      setCompletedExercises([...completedExercises, { ...currentExercise, sets }]);
      setCurrentExercise(null);
      setSelectedExercise('');
      setSets([]);

      // Automatically select the next exercise
      const nextExerciseIndex = suggestedExercises.findIndex(ex => ex._id === currentExercise._id) + 1;
      if (nextExerciseIndex < suggestedExercises.length) {
        const nextExercise = suggestedExercises[nextExerciseIndex];
        console.log('Automatically selecting next exercise:', nextExercise.name);
        setCurrentExercise(nextExercise);
        setSelectedExercise(nextExercise._id);
        setSets([]); // Reset sets for the new exercise
        
        // Fetch last data for the next exercise
        fetchLastExerciseData(nextExercise.name); // Ensure this is called
      }
    }
  };

  // Helper function to fetch last exercise data
  const fetchLastExerciseData = async (exerciseName) => {
    try {
      console.log(`Fetching last exercise data for: ${exerciseName}`);
      const response = await api.get(`/exercises/last-data/${exerciseName}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Fetched last exercise data:', response.data);
      setLastExerciseData(response.data);
      const newReps = response.data.reps !== null ? response.data.reps.toString() : '10';
      const newWeight = response.data.weight !== null ? response.data.weight.toString() : '0';
      console.log('Setting reps to:', newReps, 'and weight to:', newWeight);
      setReps(newReps);
      setWeight(newWeight);
    } catch (error) {
      console.error('Error fetching last exercise data:', error);
      setLastExerciseData({ reps: '10', weight: '0' });
      setReps('10');
      setWeight('0');
    }
  };

  const handleFinishWorkout = async () => {
    try {
      await api.put('/workouts/finish-draft');
      navigate('/');
    } catch (error) {
      console.error('Error finishing workout:', error);
      setError('Failed to finish workout. Please try again.');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="new-workout">
      <h2>New Workout</h2>
      <div className="exercise-select">
        <select value={selectedExercise} onChange={handleExerciseSelect}>
          <option value="">Select an exercise</option>
          {suggestedExercises.map(exercise => (
            <option key={exercise._id} value={exercise._id}>{exercise.name}</option>
          ))}
        </select>
      </div>
      {currentExercise && (
        <div className="current-exercise">
          <h3>{currentExercise.name}</h3>
          <div className="set-inputs">
            <div className="reps-input-group">
              <button onClick={() => handleRepsChange(-1)} className="reps-adjust-button decrease">-1</button>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="Reps"
                className="reps-input"
              />
              <button onClick={() => handleRepsChange(1)} className="reps-adjust-button increase">+1</button>
            </div>
            <div className="weight-input-group">
              <button onClick={() => handleWeightChange(-2.5)} className="weight-adjust-button decrease">-2.5</button>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight (kg)"
                className="weight-input"
              />
              <button onClick={() => handleWeightChange(2.5)} className="weight-adjust-button increase">+2.5</button>
            </div>
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