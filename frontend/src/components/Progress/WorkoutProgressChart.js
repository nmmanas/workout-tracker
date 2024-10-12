import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import Select from 'react-select';

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

const WorkoutProgressChart = ({ initialExercise }) => {
  const [selectedExercise, setSelectedExercise] = useState(initialExercise || "");
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
        setSelectedExercise(initialExercise || response.data[0].name);
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to fetch exercises');
    }
  }, [selectedExercise, initialExercise]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises, initialExercise]);

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

  const exerciseOptions = exercises.map(exercise => ({
    value: exercise.name,
    label: exercise.name
  }));

  const handleExerciseChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedExercise(selectedOption.value);
    } else {
      setSelectedExercise("");
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border rounded shadow">
          <p className="font-bold">{new Date(data.date).toLocaleDateString()}</p>
          <p>Set: {data.setIndex + 1}</p>
          <p>Weight: {data.weight} kgs</p>
          <p>Reps: {data.reps}</p>
          <p>Difficulty: {difficultyEmojis[data.difficulty]} {difficultyLabels[data.difficulty]}</p>
        </div>
      );
    }
    return null;
  };

  const renderOverallChart = () => {
    const chartData = exerciseData.flatMap((workout, workoutIndex) => 
      workout.sets.map((set, setIndex) => ({
        ...set,
        date: workout.date,
        workoutIndex,
        setIndex,
        xAxis: `${workoutIndex + 1}.${setIndex + 1}`
      }))
    );

    return (
      <div className="overall-chart mb-8">
        <h3 className="text-center text-lg font-semibold mb-2">Overall Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="xAxis" 
              tick={{ fontSize: 10 }}
              interval={0}
              label={{ value: 'Workout.Set', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}kg`}
              label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10 }}
              label={{ value: 'Reps', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight" dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="reps" stroke="#82ca9d" name="Reps" dot={{ r: 3 }} />
            {chartData.map((entry, index) => (
              <ReferenceLine
                key={index}
                x={entry.xAxis}
                stroke={difficultyColors[entry.difficulty]}
                strokeWidth={2}
                yAxisId="left"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderWorkoutChart = (workout, index) => {
    const data = workout.sets.map((set, setIndex) => ({
      ...set,
      setNumber: setIndex + 1
    }));

    return (
      <div key={index} className="workout-chart mb-4">
        <h3 className="text-center text-sm font-semibold mb-2">
          {new Date(workout.date).toLocaleDateString()}
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="setNumber"
              tick={{ fontSize: 10 }}
              label={{ value: 'Set', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}kg`}
              label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10 }}
              label={{ value: 'Reps', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: '10px' }} />
            <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight" dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="reps" stroke="#82ca9d" name="Reps" dot={{ r: 3 }} />
            {data.map((entry, i) => (
              <ReferenceLine
                key={i}
                x={entry.setNumber}
                stroke={difficultyColors[entry.difficulty]}
                strokeWidth={2}
                yAxisId="left"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (exerciseData.length === 0 && !loading) return <div>No data available for this exercise</div>;

  return (
    <div className="workout-progress-chart w-full">
      {!initialExercise && (
        <div className="exercise-select mb-4">
          <Select
            value={exerciseOptions.find(option => option.value === selectedExercise)}
            onChange={handleExerciseChange}
            options={exerciseOptions}
            isClearable
            isSearchable
            placeholder="Select or search an exercise"
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>
      )}
      {loading ? (
        <div className="loading-spinner flex justify-center items-center h-64">
          <FaSpinner className="spinner text-4xl animate-spin" />
        </div>
      ) : (
        <>
          {renderOverallChart()}
          <h3 className="text-center text-lg font-semibold mb-4">Individual Workout Progress</h3>
          <div className="charts-container">
            {exerciseData.map((workout, index) => renderWorkoutChart(workout, index))}
          </div>
        </>
      )}
      <div className="difficulty-legend mt-2 flex flex-wrap justify-center gap-2">
        {Object.entries(difficultyColors).map(([difficulty, color]) => (
          <div key={difficulty} className="difficulty-item flex items-center">
            <div className="color-indicator w-2 h-2 md:w-3 md:h-3 rounded-full mr-1" style={{ backgroundColor: color }}></div>
            <span className="text-xs">{difficultyEmojis[difficulty]} {difficultyLabels[difficulty]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutProgressChart;