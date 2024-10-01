const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Workout = require('../models/Workout');

// GET all exercises (accessible to all authenticated users)
router.get('/', auth, async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises' });
  }
});

// POST a new exercise (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    res.status(400).json({ message: 'Error creating exercise', error: error.message });
  }
});

// PUT (update) an exercise (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(updatedExercise);
  } catch (error) {
    res.status(400).json({ message: 'Error updating exercise', error: error.message });
  }
});

// DELETE an exercise (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!deletedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting exercise', error: error.message });
  }
});

// GET /api/exercises/last-data/:exerciseName (accessible to all authenticated users)
router.get('/last-data/:exerciseName', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.lastExerciseData) {
      return res.json({ reps: null, weight: null });
    }
    const lastData = user.lastExerciseData.get(req.params.exerciseName);
    if (lastData) {
      res.json(lastData);
    } else {
      res.json({ reps: null, weight: null });
    }
  } catch (error) {
    console.error('Error fetching last exercise data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add this new route at the end of the file

// GET /api/exercises/progress/:exerciseName
router.get('/progress/:exerciseName', auth, async (req, res) => {
  try {
    const { exerciseName } = req.params;
    const userId = req.user.id;

    const workouts = await Workout.find({
      user: userId,
      'exercises.name': exerciseName,
      isDraft: false
    }).sort({ date: 1 });

    const progressData = workouts.map(workout => {
      const exercise = workout.exercises.find(e => e.name === exerciseName);
      if (exercise && exercise.sets.length > 0) {
        const lastSet = exercise.sets[exercise.sets.length - 1];
        return {
          date: workout.date.toISOString(), // Ensure date is in ISO format
          weight: lastSet.weight || null,
          reps: lastSet.reps || null,
          difficulty: lastSet.difficulty || 'neutral'
        };
      }
      return null;
    }).filter(data => data !== null);

    console.log('Sending progress data:', progressData); // Add this line
    res.json(progressData);
  } catch (error) {
    console.error('Error fetching exercise progress:', error);
    res.status(500).json({ message: 'Error fetching exercise progress', error: error.message });
  }
});

module.exports = router;