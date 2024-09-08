const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

// GET /api/workouts/history
router.get('/history', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workout history:', error);
    res.status(500).json({ message: 'Error fetching workout history' });
  }
});

// POST /api/workouts
router.post('/', auth, async (req, res) => {
  try {
    const { date, exercises } = req.body;
    const newWorkout = new Workout({
      user: req.user.id,
      date,
      exercises
    });

    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/workouts/suggested
router.get('/suggested', auth, async (req, res) => {
  try {
    // Implement logic to suggest workouts based on user's history
    // This is a placeholder response
    res.json([
      { name: 'Bench Press', lastWeight: 100 },
      { name: 'Squats', lastWeight: 150 },
      { name: 'Deadlifts', lastWeight: 200 }
    ]);
  } catch (error) {
    console.error('Error fetching suggested workout:', error);
    res.status(500).json({ message: 'Error fetching suggested workout' });
  }
});

module.exports = router;