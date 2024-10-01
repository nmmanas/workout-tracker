import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Dummy data - replace this with your actual data from the database
const dummyData = [
  { date: '2023-01-01', weight: 100, reps: 8, difficulty: 'easy' },
  { date: '2023-01-08', weight: 105, reps: 8, difficulty: 'neutral' },
  { date: '2023-01-15', weight: 110, reps: 7, difficulty: 'hard' },
  { date: '2023-01-22', weight: 110, reps: 8, difficulty: 'neutral' },
  { date: '2023-01-29', weight: 115, reps: 8, difficulty: 'hard' },
  { date: '2023-02-05', weight: 120, reps: 7, difficulty: 'hard' },
  { date: '2023-02-12', weight: 120, reps: 8, difficulty: 'neutral' },
  { date: '2023-02-19', weight: 125, reps: 8, difficulty: 'easy' },
];

const difficultyColors = {
  easy: "#4CAF50",
  neutral: "#FFC107",
  hard: "#F44336"
};

const difficultyEmojis = {
  easy: "😊",
  neutral: "😐",
  hard: "😓"
};

const WorkoutProgressChart = () => {
  const [selectedExercise, setSelectedExercise] = useState("Bench Press");

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p>Weight: {data.weight} lbs</p>
          <p>Reps: {data.reps}</p>
          <p>Difficulty: {difficultyEmojis[data.difficulty]} {data.difficulty}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="workout-progress-chart">
      <h2>Workout Progress</h2>
        <div className="exercise-select">
          <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
            <option value="Bench Press">Bench Press</option>
            <option value="Squat">Squat</option>
            <option value="Deadlift">Deadlift</option>
          </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dummyData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (lbs)" />
          <Line yAxisId="right" type="monotone" dataKey="reps" stroke="#82ca9d" name="Reps" />
          {dummyData.map((entry, index) => (
            <ReferenceLine
              key={index}
              x={entry.date}
              stroke={difficultyColors[entry.difficulty]}
              strokeWidth={4}
              yAxisId="left"
              ifOverflow="extendDomain"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="difficulty-legend">
        {Object.entries(difficultyColors).map(([difficulty, color]) => (
          <div key={difficulty} className="difficulty-item">
            <div className="color-indicator" style={{ backgroundColor: color }}></div>
            <span>{difficultyEmojis[difficulty]} {difficulty}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutProgressChart;