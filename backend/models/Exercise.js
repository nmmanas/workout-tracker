const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  imageURL: {
    type: String,
    required: false
  },
  videoURL: {
    type: String,
    required: false
  },
  targetedMuscles: {
    type: [String],
    required: false
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);