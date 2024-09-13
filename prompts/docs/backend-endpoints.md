# Backend API Endpoints (Node.js + Express)

## 1. User Authentication:

### Signup Endpoint:
- POST /api/auth/signup

### Login Endpoint:
- POST /api/auth/login

## 2. Workout Management:

### Get Workout History:
- GET /api/workouts/history

### Create New Workout:
- POST /api/workouts

### Get Draft Workout:
- GET /api/workouts/draft

### Finish Draft Workout:
- PUT /api/workouts/finish-draft

## 3. Exercise Management:

### Get All Exercises:
- GET /api/exercises

### Create New Exercise (Admin only):
- POST /api/exercises

### Update Exercise (Admin only):
- PUT /api/exercises/:id

## 4. User Management:

### Get All Users (Admin only):
- GET /api/users/all

### Get Current User:
- GET /api/users/me

## 5. Admin Routes:

### Admin Dashboard:
- GET /api/admin/dashboard
