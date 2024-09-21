const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    sets: [{
      reps: {
        type: Number,
        required: true
      },
      weight: {
        type: Number,
        required: true
      },
      // Add this new field
      difficulty: {
        type: String,
        enum: ['too_easy', 'normal', 'too_hard'],
        default: 'normal'
      }
    }]
  }],
  // Add this new field
  isDraft: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);