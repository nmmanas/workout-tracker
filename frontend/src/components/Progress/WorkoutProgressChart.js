import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const difficultyColors = {
  too_easy: "#4CAF50",
  normal: "#FFC107",
  too_hard: "#F44336"
};

const difficultyEmojis = {
  too_easy: "😊",
  normal: "😐",
  too_hard: "😓"
};

const difficultyLabels = {
  too_easy: "Easy",
  normal: "Normal",
  too_hard: "Hard"
};

const WorkoutProgressChart = () => {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exerciseData, setExerciseData] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExercises = useCallback(async () => {
    try {
      const response = await axios.get('/api/exercises', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setExercises(response.data);
      if (response.data.length > 0 && !selectedExercise) {
        setSelectedExercise(response.data[0].name);
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to fetch exercises');
    }
  }, [selectedExercise]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const fetchExerciseProgress = useCallback(async (exerciseName) => {
    if (!exerciseName) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/exercises/progress/${exerciseName}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setExerciseData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching exercise progress:', err);
      setError('Failed to fetch exercise progress');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      fetchExerciseProgress(selectedExercise);
    }
  }, [selectedExercise, fetchExerciseProgress]);

  const handleExerciseChange = (e) => {
    setSelectedExercise(e.target.value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border rounded shadow">
          <p className="font-bold">{new Date(label).toLocaleDateString()}</p>
          <p>Weight: {data.weight} kgs</p>
          <p>Reps: {data.reps}</p>
          <p>Difficulty: {difficultyEmojis[data.difficulty]} {difficultyLabels[data.difficulty]}</p>
        </div>
      );
    }
    return null;
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (exerciseData.length === 0 && !loading) return <div>No data available for this exercise</div>;

  return (
    <div className="workout-progress-chart">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Workout Progress</h2>
      <div className="exercise-select mb-4">
        <select
          value={selectedExercise}
          onChange={handleExerciseChange}
          className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer appearance-none"
        >
          <option value="">Select an exercise</option>
          {exercises.map(exercise => (
            <option key={exercise._id} value={exercise.name}>{exercise.name}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="loading-spinner flex justify-center items-center h-96">
          <FaSpinner className="spinner text-4xl animate-spin" />
        </div>
      ) : (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart
              data={exerciseData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(tickItem) => new Date(tickItem).toLocaleDateString()}
              />
              <YAxis 
                yAxisId="left" 
                label={{ value: 'Weight (kgs)', angle: -90, position: 'insideLeft', style: { fill: '#8884d8' } }} 
                tick={{ fill: '#8884d8' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Reps', angle: 90, position: 'insideRight', style: { fill: '#82ca9d' } }} 
                tick={{ fill: '#82ca9d' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kgs)" dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="reps" stroke="#82ca9d" name="Reps" dot={{ r: 4 }} />
              {exerciseData.map((entry, index) => (
                <ReferenceLine
                  key={index}
                  x={entry.date}
                  stroke={difficultyColors[entry.difficulty]}
                  strokeWidth={2}
                  yAxisId="left"
                  ifOverflow="extendDomain"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="difficulty-legend mt-4 flex flex-wrap justify-center gap-2">
        {Object.entries(difficultyColors).map(([difficulty, color]) => (
          <div key={difficulty} className="difficulty-item flex items-center">
            <div className="color-indicator w-3 h-3 md:w-4 md:h-4 rounded-full mr-1 md:mr-2" style={{ backgroundColor: color }}></div>
            <span className="text-xs md:text-sm">{difficultyEmojis[difficulty]} {difficultyLabels[difficulty]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutProgressChart;