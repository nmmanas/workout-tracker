import api from '../../api/axiosConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../common.css';
import './WorkoutDashboard.css';
import WorkoutHistoryList from '../Common/WorkoutHistoryList';
import ConfirmationModal from '../Common/ConfirmationModal'; // Import the modal
import { FaSpinner } from 'react-icons/fa'; // Add this import

const WorkoutDashboard = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [hasDraft, setHasDraft] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [isLoading, setIsLoading] = useState(true); // Add this state
  const [isDraftLoading, setIsDraftLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }
        const response = await api.get('/workouts/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Workout history response:', response);
        setWorkoutHistory(response.data);
      } catch (error) {
        console.error('Error fetching workout history:', error);
        setError('Failed to fetch workout history. Please login again.');
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized, removing token and redirecting to login');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkoutHistory();
  }, [navigate]);

  useEffect(() => {
    const checkDraft = async () => {
      setIsDraftLoading(true);
      try {
        const response = await api.get('/workouts/draft');
        setHasDraft(!!response.data);
      } catch (error) {
        console.error('Error checking draft:', error);
      } finally {
        setIsDraftLoading(false);
      }
    };
    checkDraft();
  }, []);

  const handleStartWorkout = () => {
    navigate('/new-workout');
  };

  const handleContinueWorkout = () => {
    navigate('/new-workout');
  };

  const handleDiscardDraft = () => {
    setIsModalOpen(true); // Open the modal
  };

  const confirmDiscardDraft = async () => {
    setIsLoading(true); // Set loading to true when starting the discard process
    try {
      await api.delete('/workouts/draft');
      setHasDraft(false);
      
      // Update workoutHistory to remove the draft workout
      setWorkoutHistory(prevHistory => prevHistory.filter(workout => !workout.isDraft));
      
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error discarding draft workout:', error);
      setError('Failed to discard draft workout. Please try again.');
    } finally {
      setIsLoading(false); // Set loading back to false when the process is complete
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="workout-dashboard">
      <div className="dashboard-header">
        <h2>Workout Dashboard</h2>
        {isDraftLoading ? (
          <div className="loading-spinner"><FaSpinner className="spinner" /></div>
        ) : hasDraft ? (
          <div className="workout-actions">
            <button onClick={handleContinueWorkout} className="start-workout-button continue-workout">Continue Workout</button>
            <button onClick={handleDiscardDraft} className="discard-draft-button">Discard Draft</button>
          </div>
        ) : (
          <button onClick={handleStartWorkout} className="start-workout-button">Start New Workout</button>
        )}
      </div>
      <div className="workout-history">
        <h3>Recent Workouts</h3>
        {isLoading ? (
          <div className="loading-spinner"><FaSpinner className="spinner" /></div>
        ) : workoutHistory.length > 0 ? (
          <WorkoutHistoryList workouts={workoutHistory.map(workout => ({
            ...workout,
            isDraft: workout.isDraft || false
          }))} limit={5} />
        ) : (
          <p>No workout history available.</p>
        )}
      </div>
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={confirmDiscardDraft} 
        title="Confirm Discard Draft"
        message="Are you sure you want to discard the draft workout?"
        isLoading={isLoading} // Pass the loading state to the modal
      />
    </div>
  );
};

export default WorkoutDashboard;