#!/bin/bash

if [ "$1" == "login" ]; then
  curl \
    -d '{"email":"example@gmail.com", "password":"1234"}' \
    -H "Content-Type: application/json" \
    -X POST http://localhost:8000/api/v1/user/login
else
      echo "Provide a command"
fi
