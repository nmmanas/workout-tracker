import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="font-bold">{label}</p>
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
      <h2 className="text-xl md:text-2xl font-bold mb-4">Workout Progress</h2>
      <div className="chart-controls">
        <div className="exercise-select">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full md:w-auto p-2 border rounded-md bg-white"
          >
            <option value="Bench Press">Bench Press</option>
            <option value="Squat">Squat</option>
            <option value="Deadlift">Deadlift</option>
          </select>
        </div>
      </div>
      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dummyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              interval={isMobile ? 1 : 0}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 50 : 30}
            />
            <YAxis 
              yAxisId="left" 
              tick={{ fontSize: isMobile ? 10 : 12 }} 
              width={30}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fontSize: isMobile ? 10 : 12 }} 
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
            <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (lbs)" />
            <Line yAxisId="right" type="monotone" dataKey="reps" stroke="#82ca9d" name="Reps" />
            {dummyData.map((entry, index) => (
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
      <div className="difficulty-legend mt-4 flex flex-wrap justify-center gap-2">
        {Object.entries(difficultyColors).map(([difficulty, color]) => (
          <div key={difficulty} className="difficulty-item flex items-center">
            <div className="color-indicator w-3 h-3 md:w-4 md:h-4 rounded-full mr-1 md:mr-2" style={{ backgroundColor: color }}></div>
            <span className="text-xs md:text-sm">{difficultyEmojis[difficulty]} {difficulty}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutProgressChart;