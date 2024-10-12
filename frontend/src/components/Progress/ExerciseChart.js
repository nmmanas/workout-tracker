import React, { useState, useEffect } from 'react';
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
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const updateChartWidth = () => {
      const chart = document.querySelector('.recharts-wrapper');
      if (chart) {
        setChartWidth(chart.clientWidth);
      }
    };

    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);

    return () => window.removeEventListener('resize', updateChartWidth);
  }, []);

  const formatXAxisTick = (value) => {
    if (typeof value === 'string' && value.includes('.')) {
      if (chartWidth < 500) {
        // For smaller screens, only show the first number
        return value.split('.')[0];
      }
      return value;
    }
    // For other types of values (e.g., numbers), return as is
    return value;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 10 }}
          interval={0}
          tickFormatter={formatXAxisTick}
          label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : null}
        />
        <YAxis 
          yAxisId="left"
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => `${value}kg`}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" dot={{ r: 3 }} />
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
