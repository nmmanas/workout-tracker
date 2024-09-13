const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');
const User = require('../models/User');

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

    // Update the user's lastExerciseData
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.lastExerciseData) {
      user.lastExerciseData = new Map();
    }
    exercises.forEach(exercise => {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      user.lastExerciseData.set(exercise.name, {
        reps: lastSet.reps,
        weight: lastSet.weight
      });
    });
    await user.save();

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

// POST /api/workouts/draft
router.post('/draft', auth, async (req, res) => {
  try {
    const { date, exercises } = req.body;
    let draft = await Workout.findOne({ user: req.user.id, isDraft: true });

    if (draft) {
      // Update existing draft
      draft.date = date;
      draft.exercises = exercises;
    } else {
      // Create new draft
      draft = new Workout({
        user: req.user.id,
        date,
        exercises,
        isDraft: true
      });
    }

    await draft.save();
    res.status(201).json(draft);
  } catch (error) {
    console.error('Error saving draft workout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/workouts/draft
router.get('/draft', auth, async (req, res) => {
  try {
    const draft = await Workout.findOne({ user: req.user.id, isDraft: true });
    if (!draft) {
      return res.status(404).json({ message: 'No draft workout found' });
    }
    res.json(draft);
  } catch (error) {
    console.error('Error fetching draft workout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/workouts/finish-draft
router.put('/finish-draft', auth, async (req, res) => {
  try {
    const draft = await Workout.findOne({ user: req.user.id, isDraft: true });
    if (!draft) {
      return res.status(404).json({ message: 'No draft workout found' });
    }
    draft.isDraft = false;
    await draft.save();

    // Update the user's lastExerciseData
    const user = await User.findById(req.user.id);
    if (!user.lastExerciseData) {
      user.lastExerciseData = new Map();
    }
    draft.exercises.forEach(exercise => {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      user.lastExerciseData.set(exercise.name, {
        reps: lastSet.reps,
        weight: lastSet.weight
      });
    });
    await user.save();

    res.json(draft);
  } catch (error) {
    console.error('Error finishing draft workout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/workouts/draft
router.delete('/draft', auth, async (req, res) => {
  try {
    const result = await Workout.findOneAndDelete({ user: req.user.id, isDraft: true });
    if (!result) {
      return res.status(404).json({ message: 'No draft workout found' });
    }
    res.json({ message: 'Draft workout discarded successfully' });
  } catch (error) {
    console.error('Error discarding draft workout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;