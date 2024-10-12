import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

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

const ExerciseChart = ({ data, xAxisKey, xAxisLabel, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 10 }}
          interval={0}
          label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }}
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
        {data.map((entry, index) => (
          <ReferenceLine
            key={index}
            x={entry[xAxisKey]}
            stroke={difficultyColors[entry.difficulty]}
            strokeWidth={2}
            yAxisId="left"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExerciseChart;
