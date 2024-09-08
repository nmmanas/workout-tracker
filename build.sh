#!/bin/bash

# Build frontend
cd ./frontend
npm install
npm run build

# Run Docker Compose
docker-compose build