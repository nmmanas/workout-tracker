import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import WorkoutDashboard from './components/Dashboard/WorkoutDashboard';
import WorkoutHistory from './components/History/WorkoutHistory';
import NewWorkout from './components/Workout/NewWorkout';
import ExercisesPage from './components/Exercises/ExercisesPage';
import Layout from './components/Layout/Layout';
import UsersPage from './components/Users/UsersPage';
import ProgressPage from './components/Progress/ProgressPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found in ProtectedRoute, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<WorkoutDashboard />} />
                  <Route path="/history" element={<WorkoutHistory />} />
                  <Route path="/new-workout" element={<NewWorkout />} />
                  <Route path="/exercises" element={<ExercisesPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;