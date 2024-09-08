# Database Design (MongoDB)

## Users Collection:
Tracks user authentication details and references workout history.

```
{
  "_id": ObjectId,
  "email": String,
  "passwordHash": String,
  "name": String,
  "workoutHistory": [Workout]
}
```

## Workouts Collection:
Tracks each workout, including the exercises, weights, reps, and sets.

```
{
  "_id": ObjectId,
  "userId": ObjectId,
  "date": Date,
  "workoutOrder": [String],  // Order of exercises
  "exercises": [
    {
      "exerciseId": String,   // Exercise reference
      "name": String,         // Exercise name (can be fetched dynamically)
      "sets": [
        {
          "setNumber": Number,  // Set index (1, 2, 3)
          "reps": Number,       // Repetitions for each set
          "weight": Number      // Weight used for each set
        }
      ]
    }
  ]
}
```

## Exercises Collection:
Stores the details of individual exercises, including a video URL for the correct form and an image of the targeted muscles.

```
{
  "_id": ObjectId,
  "name": String,
  "targetedMuscles": [String], // List of muscles targeted
  "videoURL": String,          // URL to GIF/Video demonstrating form
  "imageURL": String           // URL to image showing muscles targeted
}
```