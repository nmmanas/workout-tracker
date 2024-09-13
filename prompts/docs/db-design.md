# Database Design (MongoDB)

## Users Collection:
Tracks user authentication details and last exercise data.

```
{
  "id": ObjectId,
  "email": String,
  "passwordHash": String,
  "name": String,
  "lastExerciseData": Map, // Stores last used weight and reps for each exercise
  "isAdmin": Boolean
}
```

## Workouts Collection:
Tracks each workout, including the exercises, weights, reps, and sets.

```
{
  "id": ObjectId,
  "user": ObjectId, // Reference to User
  "date": Date,
  "exercises": [
    {
      "name": String,
      "sets": [
        {
          "reps": Number,
          "weight": Number
        }
      ]
    }
  ],
  "isDraft": Boolean
}
```

## Exercises Collection:
Stores the details of individual exercises, including a video URL for the correct form and an image of the targeted muscles.

```
{
  "id": ObjectId,
  "name": String,
  "targetedMuscles": [String], // List of muscles targeted
  "videoURL": String,          // URL to video demonstrating form
  "imageURL": String           // URL to image showing muscles targeted
}
```