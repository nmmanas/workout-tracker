require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Trust proxy - Add this line
app.set('trust proxy', 1);

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

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