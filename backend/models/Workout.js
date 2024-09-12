const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
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
    sets: [{
      reps: {
        type: Number,
        required: true
      },
      weight: {
        type: Number,
        required: true
      }
    }]
  }],
  isDraft: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);