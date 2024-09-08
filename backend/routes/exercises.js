const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const auth = require('../middleware/auth');

// GET all exercises
router.get('/', auth, async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises' });
  }
});

// POST a new exercise
router.post('/', auth, async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    res.status(400).json({ message: 'Error creating exercise', error: error.message });
  }
});

// PUT (update) an exercise
router.put('/:id', auth, async (req, res) => {
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

// DELETE an exercise
router.delete('/:id', auth, async (req, res) => {
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

module.exports = router;