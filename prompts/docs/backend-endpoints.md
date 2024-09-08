# Backend API Endpoints (Node.js + Express)

## 1. User Authentication:

### Signup Endpoint:

```javascript
// POST /api/auth/signup
const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, passwordHash: hashedPassword, name });
  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
};
```

### Login Endpoint:

```javascript
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};
```

## 2. Workout Management:

### Get Workout History:

```javascript
// GET /api/workouts/history
const getWorkoutHistory = async (req, res) => {
  const userId = req.user._id;  // Assume user is authenticated via JWT
  const workouts = await Workout.find({ userId }).sort({ date: -1 });
  res.json(workouts);
};
```

### Create New Workout:

```javascript
// POST /api/workouts
const createWorkout = async (req, res) => {
  const { workoutOrder, exercises } = req.body;
  const newWorkout = new Workout({
    userId: req.user._id,
    date: new Date(),
    workoutOrder,
    exercises
  });
  await newWorkout.save();
  res.status(201).json({ message: 'Workout saved successfully' });
};
```

### Fetch Exercise Details:

```javascript
// GET /api/exercises/:id
const getExerciseDetails = async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);
  res.json(exercise);
};
```
