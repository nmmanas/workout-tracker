import React from 'react';
import '../common.css';
import './ProgressPage.css';
import WorkoutProgressChart from './WorkoutProgressChart';

const ProgressPage = () => {
  return (
    <div className="progress-page">
      <h2>Progress</h2>
      <WorkoutProgressChart />
    </div>
  );
};

export default ProgressPage;