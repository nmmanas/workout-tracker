"use client"

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
]

const difficultyColors = {
  easy: "#4CAF50",
  neutral: "#FFC107",
  hard: "#F44336"
}

const difficultyEmojis = {
  easy: "😊",
  neutral: "😐",
  hard: "😓"
}

export default function WorkoutProgressChart() {
  const [selectedExercise, setSelectedExercise] = useState("Bench Press")

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background p-4 border rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p>Weight: {data.weight} lbs</p>
          <p>Reps: {data.reps}</p>
          <p>Difficulty: {difficultyEmojis[data.difficulty]} {data.difficulty}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Workout Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={setSelectedExercise} defaultValue={selectedExercise}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bench Press">Bench Press</SelectItem>
              <SelectItem value="Squat">Squat</SelectItem>
              <SelectItem value="Deadlift">Deadlift</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="mt-4 flex justify-center space-x-4">
          {Object.entries(difficultyColors).map(([difficulty, color]) => (
            <div key={difficulty} className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></div>
              <span>{difficultyEmojis[difficulty]} {difficulty}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}