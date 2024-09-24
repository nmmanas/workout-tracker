import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import '../common.css';
import './NewWorkout.css';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';

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

  const handleWeightChange = (index, amount) => {
    if (sets[index].completed) return; // Don't change if set is completed
    const updatedSets = sets.map((set, idx) => {
      if (idx === index) {
        // Update the current set
        const newWeight = Math.max(0, parseFloat(set.weight) + amount);
        return { ...set, weight: newWeight };
      } else if (idx > index) {
        // Update all subsequent sets to match the new weight of the changed set
        return { ...set, weight: Math.max(0, parseFloat(sets[index].weight) + amount) };
      }
      // Leave previous sets unchanged
      return set;
    });
    setSets(updatedSets);
  };

  const handleRepsChange = (index, amount) => {
    if (sets[index].completed) return; // Don't change if set is completed
    const updatedSets = sets.map((set, idx) => {
      if (idx === index) {
        // Update the current set
        const newReps = Math.max(0, parseInt(set.reps) + amount);
        return { ...set, reps: newReps };
      } else if (idx > index) {
        // Update all subsequent sets to match the new reps of the changed set
        return { ...set, reps: Math.max(0, parseInt(sets[index].reps) + amount) };
      }
      // Leave previous sets unchanged
      return set;
    });
    setSets(updatedSets);
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
        if (response.data && response.data.exercises.length > 0) {
          setCompletedExercises(response.data.exercises);
          
          // 1. Find the last added exercise to the draft workout
          const lastExercise = response.data.exercises[response.data.exercises.length - 1];
          
          // 2. Pick the next exercise based on the last added one
          const lastExerciseIndex = suggestedExercises.findIndex(ex => ex.name === lastExercise.name);
          if (lastExerciseIndex !== -1 && lastExerciseIndex + 1 < suggestedExercises.length) {
            const nextExercise = suggestedExercises[lastExerciseIndex + 1];
            
            // 3. Populate the exercise picker with the next exercise
            setCurrentExercise(nextExercise);
            setSelectedExercise(nextExercise._id);
            
            // Fetch last data for the next exercise
            fetchLastExerciseData(nextExercise.name);
          } else {
            console.log('No more exercises available in the suggested list.');
            // You might want to handle this case, perhaps by allowing the user to select any exercise
          }
        }
      } catch (error) {
        console.error('Error fetching draft:', error);
      }
    };
    fetchDraft();
  }, [suggestedExercises]); // Add suggestedExercises as a dependency

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
        
        const newReps = response.data.reps !== null ? response.data.reps.toString() : '10';
        const newWeight = response.data.weight !== null ? response.data.weight.toString() : '0';
        
        setReps(newReps);
        setWeight(newWeight);
        setLastAddedSet(null);

        // Automatically add 3 default sets with reset difficulty
        const defaultSets = Array.from({ length: 3 }, () => ({
          reps: parseInt(newReps),
          weight: parseFloat(newWeight),
          completed: false,
          difficulty: 'normal' // Reset difficulty to 'normal'
        }));
        setSets(defaultSets);
      } catch (error) {
        console.error('Error fetching last exercise data:', error);
        setLastExerciseData({ reps: '10', weight: '0' });
        setReps('10');
        setWeight('0');

        // Add 3 default sets with default values and reset difficulty
        const defaultSets = Array.from({ length: 3 }, () => ({
          reps: 10,
          weight: 0,
          completed: false,
          difficulty: 'normal' // Reset difficulty to 'normal'
        }));
        setSets(defaultSets);
      }
    } else {
      setCurrentExercise(null);
      setSets([]);
      setLastExerciseData({ reps: '', weight: '' });
      setLastAddedSet(null);
    }
  };

  const handleAddSet = () => {
    const newSet = { 
      reps: parseInt(reps), 
      weight: parseFloat(weight), 
      completed: false,
      difficulty: 'normal' // Ensure new sets have 'normal' difficulty
    };
    setSets([...sets, newSet]);
    setLastAddedSet(newSet);
  };

  const toggleSetCompletion = (index) => {
    const updatedSets = [...sets];
    const currentSet = updatedSets[index];

    if (!currentSet.completed) {
      // Completing a set
      const allPreviousCompleted = updatedSets.slice(0, index).every(set => set.completed);
      if (allPreviousCompleted) {
        currentSet.completed = true;
      }
    } else {
      // Incompleting a set
      const allSubsequentIncompleted = updatedSets.slice(index + 1).every(set => !set.completed);
      if (allSubsequentIncompleted) {
        currentSet.completed = false;
      }
    }

    setSets(updatedSets);
  };

  const handleSetChange = (index, field, value) => {
    if (sets[index].completed) return; // Don't change if set is completed
    const updatedSets = sets.map((set, idx) => 
      idx === index ? { ...set, [field]: value } : set
    );
    setSets(updatedSets);
  };

  const handleSetDifficulty = (index, difficulty) => {
    const updatedSets = sets.map((set, idx) => 
      idx === index ? { ...set, difficulty } : set
    );
    setSets(updatedSets);
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
      // Filter to save only completed sets
      const completedSets = sets.filter(set => set.completed);
      if (completedSets.length > 0) {
        setCompletedExercises([...completedExercises, { ...currentExercise, sets: completedSets }]);
      }
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

      // Add 3 default sets
      const defaultSets = Array.from({ length: 3 }, () => ({
        reps: parseInt(newReps),
        weight: parseFloat(newWeight),
        completed: false,
        difficulty: 'normal' // Default difficulty
      }));
      setSets(defaultSets);
    } catch (error) {
      console.error('Error fetching last exercise data:', error);
      setLastExerciseData({ reps: '10', weight: '0' });
      setReps('10');
      setWeight('0');

      // Add 3 default sets with default values
      const defaultSets = Array.from({ length: 3 }, () => ({
        reps: 10,
        weight: 0,
        completed: false,
        difficulty: 'normal' // Default difficulty
      }));
      setSets(defaultSets);
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

  const handleRemoveSet = (index) => {
    const updatedSets = sets.filter((_, idx) => idx !== index);
    setSets(updatedSets);
  };

  const difficultyEmojis = {
    too_easy: '😊',
    normal: '😐',
    too_hard: '😓'
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
            {sets.map((set, index) => {
              const canComplete = sets.slice(0, index).every(s => s.completed);
              const canIncomplete = sets.slice(index + 1).every(s => !s.completed);
              
              return (
                <div key={index} className="set-row">
                  <div className="set-number">{index + 1}</div>
                  <div className="set-inputs-group">
                    <div className="input-group">
                      <label>Reps</label>
                      <div className="input-controls">
                        <button onClick={() => handleRepsChange(index, -1)} disabled={set.completed}><FaMinus /></button>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleSetChange(index, 'reps', parseInt(e.target.value))}
                          disabled={set.completed}
                        />
                        <button onClick={() => handleRepsChange(index, 1)} disabled={set.completed}><FaPlus /></button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Weight (kg)</label>
                      <div className="input-controls">
                        <button onClick={() => handleWeightChange(index, -2.5)} disabled={set.completed}><FaMinus /></button>
                        <input
                          type="number"
                          step="0.1"
                          value={set.weight}
                          onChange={(e) => handleSetChange(index, 'weight', parseFloat(e.target.value))}
                          disabled={set.completed}
                        />
                        <button onClick={() => handleWeightChange(index, 2.5)} disabled={set.completed}><FaPlus /></button>
                      </div>
                    </div>
                  </div>
                  <div className="set-actions-group">
                    <div className="set-actions">
                      <button 
                        onClick={() => toggleSetCompletion(index)}
                        className={`complete-set-button 
                          ${set.completed ? 'complete' : 'incomplete'}
                          ${!set.completed && !canComplete ? 'disabled' : ''}
                          ${set.completed && !canIncomplete ? 'disabled' : ''}`}
                        aria-label={set.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        disabled={(!set.completed && !canComplete) || (set.completed && !canIncomplete)}
                      >
                        {set.completed ? '✓' : '○'}
                      </button>
                      <button 
                        onClick={() => handleRemoveSet(index)}
                        className={`remove-set-button ${set.completed ? 'disabled' : ''}`}
                        aria-label="Remove set"
                        disabled={set.completed}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="set-difficulty">
                      {Object.entries(difficultyEmojis).map(([difficulty, emoji]) => (
                        <button 
                          key={difficulty}
                          onClick={() => handleSetDifficulty(index, difficulty)}
                          className={`difficulty-button ${set.difficulty === difficulty ? 'active' : ''}`}
                          aria-label={difficulty.replace('_', ' ')}
                          disabled={!set.completed}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="add-set-row">
              <button onClick={handleAddSet} className="add-set-button">
                <FaPlus />
              </button>
            </div>
          </div>
          <button onClick={handleCompleteExercise} className="complete-exercise-button">Complete Exercise</button>
        </div>
      )}
      <div className="completed-exercises">
        <h3>Completed Exercises</h3>
        {completedExercises.map((exercise, index) => (
          <div key={index} className="completed-exercise-item">
            <h4>{exercise.name}</h4>
            {exercise.sets.map((set, setIndex) => (
              <p key={setIndex}>
                Set {setIndex + 1}: {set.reps} reps @ {set.weight} kg 
                <span className="difficulty-indicator">
                  {difficultyEmojis[set.difficulty]}
                </span>
              </p>
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