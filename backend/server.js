require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const identifyTenant = require('./middleware/tenantIdentification');
const createOrGetDefaultTenant = require('./utils/defaultTenant');

const app = express();

// Trust proxy - Add this line
app.set('trust proxy', 1);

// Connect Database
connectDB();

// Create or get default tenant
createOrGetDefaultTenant()
  .then(defaultTenant => {
    console.log('Default tenant ID:', defaultTenant._id);
    // You can store this ID in a global variable or in your app's context if needed
  })
  .catch(error => {
    console.error('Failed to create/get default tenant:', error);
    process.exit(1);
  });

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// Apply tenant identification middleware
app.use(identifyTenant);

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/exercises', exercisesRouter);
app.use('/api/users', usersRouter);

// Use environment variables
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(helmet());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));