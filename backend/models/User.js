const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: { 
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // Add this new field
  lastExerciseData: {
    type: Map,
    of: {
      reps: Number,
      weight: Number
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);