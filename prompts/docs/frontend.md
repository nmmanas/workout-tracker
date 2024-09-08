# Frontend Implementation (React)

## 1. Authentication (Login/Signup):

### Signup Form:

Collect user credentials (email, password, name).
Make a POST request to the /api/auth/signup endpoint.

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signup', { email, password, name });
      console.log('Signup successful:', response.data);
    } catch (error) {
      console.error('Signup failed:', error.response.data); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /> 
      <button type="submit">Signup</button>
    </form>
  );
};

export default SignupForm;
``` 

### Login Form:

Collect email and password.
On success, store the JWT token in localStorage or sessionStorage for authentication.

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      // Redirect to the dashboard or another protected route
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
```

## 2. Workout Tracking Dashboard:

### Fetch & Suggest Next Workout:

Fetch the last workout's workoutOrder and suggest the next exercise by showing it on the dashboard.

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutDashboard = () => {
  const [suggestedWorkout, setSuggestedWorkout] = useState([]);

  useEffect(() => {
    // Fetch suggested workout based on history
    const fetchSuggestedWorkout = async () => {
      const response = await axios.get('/api/workouts/suggested', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuggestedWorkout(response.data);
    };
    fetchSuggestedWorkout();    
  }, []);

  return (
    <div>
      <h2>Your Suggested Workout</h2>
      {suggestedWorkout.length > 0 ? (
        suggestedWorkout.map((exercise, index) => (
          <div key={index}>
            <h3>{exercise.name}</h3>    
            <p>Last used weight: {exercise.lastWeight} kg</p>
            <input type="number" defaultValue={exercise.lastWeight} />
          </div>
        ))
      ) : (
        <p>No workouts found.</p>
      )}
    </div>  
  );
};

export default WorkoutDashboard;
```

### Track Weight:

Display the last used weight when starting a new workout and provide input fields to adjust it if necessary.

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutDashboard = () => {
  const [suggestedWorkout, setSuggestedWorkout] = useState([]);
  useEffect(() => {
    // Fetch suggested workout based on history
    const fetchSuggestedWorkout = async () => {
      const response = await axios.get('/api/workouts/suggested', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuggestedWorkout(response.data);
    };
    fetchSuggestedWorkout();
  }, []);

  return (
    <div>
      <h2>Your Suggested Workout</h2>
      {suggestedWorkout.length > 0 ? (
        suggestedWorkout.map((exercise, index) => (
          <div key={index}>
            <h3>{exercise.name}</h3>
            <p>Last used weight: {exercise.lastWeight} kg</p>
            <input type="number" defaultValue={exercise.lastWeight} />
          </div>
        ))
      ) : (
        <p>No workouts found.</p>
      )}
    </div>
  );
};

export default WorkoutDashboard;
```
### Workout Start:

When a user selects a workout, fetch the corresponding video and targeted muscle image from the Exercises collection and display them during the workout.

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutDashboard = () => {
  const [suggestedWorkout, setSuggestedWorkout] = useState([]);

  useEffect(() => {
    // Fetch suggested workout based on history
    const fetchSuggestedWorkout = async () => {
      const response = await axios.get('/api/workouts/suggested', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuggestedWorkout(response.data);
    };
    fetchSuggestedWorkout();
  }, []);

  return (
    <div>
      <h2>Your Suggested Workout</h2>
      {suggestedWorkout.length > 0 ? (
        suggestedWorkout.map((exercise, index) => (
          <div key={index}>
            <h3>{exercise.name}</h3>
            <p>Last used weight: {exercise.lastWeight} kg</p>
            <input type="number" defaultValue={exercise.lastWeight} />
          </div>
        ))
      ) : (
        <p>No workouts found.</p>
      )}
    </div>
  );
};

export default WorkoutDashboard;
```

## 3. Workout History:

### View History:

Display a list of past workouts with details like date, exercises, sets, reps, and weights.

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutHistory = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);

  useEffect(() => {
    // Fetch workout history
    const fetchHistory = async () => {
      const response = await axios.get('/api/workouts/history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWorkoutHistory(response.data);
    };
    fetchHistory();
  }, []);

  return (
    <div className="workout-history">
      <h2>Your Workout History</h2>
      {workoutHistory.length > 0 ? (
        workoutHistory.map((workout, index) => (
          <div key={index}>
            <h3>Workout on {new Date(workout.date).toLocaleDateString()}</h3>
            {workout.exercises.map((exercise, idx) => (
              <div key={idx}>
                <strong>{exercise.name}</strong>
                {exercise.sets.map((set, sIdx) => (
                  <p key={sIdx}>Set {set.setNumber}: {set.reps} reps @ {set.weight} kg</p>
                ))}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No workout history available.</p>
      )}
    </div>
  );
};

export default WorkoutHistory;
```

### Filter History:

Allow users to filter workouts by date or exercise type.

```javascript
import React, { useState } from 'react';

const WorkoutHistory = () => {
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    // Filter workouts based on the selected date or exercise type
    const filtered = workoutHistory.filter(workout => {
      const dateMatch = new Date(workout.date).toLocaleDateString().includes(filter);
      const exerciseMatch = workout.exercises.some(exercise => exercise.name.includes(filter));
      return dateMatch || exerciseMatch;
    });
    setFilteredWorkouts(filtered);
  };

  return (
    <div>
      <input type="date" value={filter} onChange={handleFilterChange} />
      <input type="text" placeholder="Filter by exercise" value={filter} onChange={handleFilterChange} />
      {filteredWorkouts.length > 0 ? (
        filteredWorkouts.map((workout, index) => (
          <div key={index}>
            <h3>Workout on {new Date(workout.date).toLocaleDateString()}</h3>
            {workout.exercises.map((exercise, idx) => (
              <div key={idx}>
                <strong>{exercise.name}</strong>
                {exercise.sets.map((set, sIdx) => (
                  <p key={sIdx}>Set {set.setNumber}: {set.reps} reps @ {set.weight} kg</p>
                ))}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No workouts found.</p>
      )}
    </div>
  );
};

export default WorkoutHistory;
```

## 4. Exercise Instructions:

### Display Instructions:

Show the video and muscle image for each exercise in the workout.
```javascript
import React from 'react';

const ExerciseInstructions = ({ exercise }) => {
  return (
    <div>
      <h3>{exercise.name}</h3>
      <img src={exercise.imageURL} alt={exercise.name} />
      <video src={exercise.videoURL} controls />
    </div>
  );
};

export default ExerciseInstructions;
```
## 5. User Authentication:

### JWT Storage:

Store the JWT token in localStorage or sessionStorage.

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutDashboard = () => {
  const [suggestedWorkout, setSuggestedWorkout] = useState([]);

  useEffect(() => {
    // Fetch suggested workout based on history
    const fetchSuggestedWorkout = async () => {
      const response = await axios.get('/api/workouts/suggested', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuggestedWorkout(response.data);
    };
    fetchSuggestedWorkout();
  }, []);

  return (
    <div>
      <h2>Your Suggested Workout</h2>
      {suggestedWorkout.length > 0 ? (
        suggestedWorkout.map((exercise, index) => (
          <div key={index}> 
            <h3>{exercise.name}</h3>
            <p>Last used weight: {exercise.lastWeight} kg</p>
            <input type="number" defaultValue={exercise.lastWeight} />
          </div>
        ))
      ) : (
        <p>No workouts found.</p>
      )}    
    </div>
  );
};

export default WorkoutDashboard;
``` 

### Protected Routes:

Ensure that only authenticated users can access protected routes.

### JWT Verification:

On protected routes, verify the JWT token before allowing access.

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutDashboard = () => {
  const [suggestedWorkout, setSuggestedWorkout] = useState([]);

  useEffect(() => {
    // Fetch suggested workout based on history 
    const fetchSuggestedWorkout = async () => {
      const response = await axios.get('/api/workouts/suggested', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuggestedWorkout(response.data);
    };
    fetchSuggestedWorkout();
  }, []);   
}
```