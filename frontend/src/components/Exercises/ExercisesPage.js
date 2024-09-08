import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../common.css';
import './ExercisesPage.css';

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: '', imageURL: '', videoURL: '', targetedMuscles: '' });
  const [editingExercise, setEditingExercise] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchExercises = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get('/api/exercises', {
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
  }, [navigate]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingExercise) {
      setEditingExercise({ ...editingExercise, [name]: value });
    } else {
      setNewExercise({ ...newExercise, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const exerciseData = editingExercise || newExercise;
      if (exerciseData.targetedMuscles) {
        exerciseData.targetedMuscles = exerciseData.targetedMuscles.split(',').map(muscle => muscle.trim());
      } else {
        exerciseData.targetedMuscles = [];
      }
      
      if (editingExercise) {
        await axios.put(`/api/exercises/${editingExercise._id}`, exerciseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/exercises', exerciseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchExercises();
      setNewExercise({ name: '', imageURL: '', videoURL: '', targetedMuscles: '' });
      setEditingExercise(null);
    } catch (error) {
      console.error('Error saving exercise:', error);
      setError('Failed to save exercise. Please try again.');
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise({ 
      ...exercise, 
      targetedMuscles: exercise.targetedMuscles ? exercise.targetedMuscles.join(', ') : '' 
    });
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the exercise "${name}"?`);
    if (isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        await axios.delete(`/api/exercises/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchExercises();
      } catch (error) {
        console.error('Error deleting exercise:', error);
        setError('Failed to delete exercise. Please try again.');
      }
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="exercises-page">
      <h2>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</h2>
      <form onSubmit={handleSubmit} className="exercise-form">
        <input
          type="text"
          name="name"
          value={editingExercise ? editingExercise.name : newExercise.name}
          onChange={handleInputChange}
          placeholder="Exercise Name"
          required
        />
        <input
          type="url"
          name="imageURL"
          value={editingExercise ? editingExercise.imageURL : newExercise.imageURL}
          onChange={handleInputChange}
          placeholder="Image URL (optional)"
        />
        <input
          type="url"
          name="videoURL"
          value={editingExercise ? editingExercise.videoURL : newExercise.videoURL}
          onChange={handleInputChange}
          placeholder="Video URL (optional)"
        />
        <input
          type="text"
          name="targetedMuscles"
          value={editingExercise ? editingExercise.targetedMuscles : newExercise.targetedMuscles}
          onChange={handleInputChange}
          placeholder="Targeted Muscles (comma-separated, optional)"
        />
        <button type="submit">{editingExercise ? 'Update Exercise' : 'Add Exercise'}</button>
        {editingExercise && (
          <button type="button" onClick={() => setEditingExercise(null)}>Cancel Edit</button>
        )}
      </form>
      <h3>Exercise List</h3>
      <div className="exercise-list">
        {exercises.map((exercise) => (
          <div key={exercise._id} className="exercise-item">
            <h4>{exercise.name}</h4>
            {exercise.targetedMuscles && exercise.targetedMuscles.length > 0 && (
              <p>Targeted Muscles: {exercise.targetedMuscles.join(', ')}</p>
            )}
            {exercise.imageURL && <p>Image URL: {exercise.imageURL}</p>}
            {exercise.videoURL && <p>Video URL: {exercise.videoURL}</p>}
            <div className="exercise-actions">
              <button onClick={() => handleEdit(exercise)}>Edit</button>
              <button onClick={() => handleDelete(exercise._id, exercise.name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesPage;