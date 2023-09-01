#!/bin/bash

# Start the backend server in the background
(cd backend && npm run dev) &

# Start the frontend server in the background
(cd frontend/telegraph && npm run dev) &

# Wait for both background processes to finish
wait
