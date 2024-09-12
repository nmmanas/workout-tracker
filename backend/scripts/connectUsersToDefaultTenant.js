require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const connectDB = require('../config/db');

const connectUsersToDefaultTenant = async () => {
  try {
    await connectDB();
    
    const defaultTenant = await Tenant.findOne({ subdomain: 'default' });
    if (!defaultTenant) {
      console.error('Default tenant not found. Please run createOrGetDefaultTenant first.');
      process.exit(1);
    }

    const updateResult = await User.updateMany(
      { tenant: { $exists: false } },
      { $set: { tenant: defaultTenant._id } }
    );

    console.log(`Updated ${updateResult.nModified} users to default tenant.`);

    // Update Workout model to include tenant field
    const Workout = require('../models/Workout');
    const workoutUpdateResult = await Workout.updateMany(
      { tenant: { $exists: false } },
      { $set: { tenant: defaultTenant._id } }
    );

    console.log(`Updated ${workoutUpdateResult.nModified} workouts to default tenant.`);

  } catch (error) {
    console.error('Error connecting users to default tenant:', error);
  } finally {
    mongoose.disconnect();
  }
};

connectUsersToDefaultTenant();