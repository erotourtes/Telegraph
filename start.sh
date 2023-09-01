#!/bin/sh

# echo -e \
# "VITE_REACT_APP_BASE_URL=http://backend:8000\n\
# VITE_REACT_APP_WS_URL=ws://backend:8000" >> ./frontend/telegraph/.env

# check for docker-compose existance
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found"
    exit
fi

node ./replace.env.mjs
docker-compose -f ./docker-compose.local.yml up --build

rm ./docker-compose.local.yml
# rm ./frontend/telegraph/.env
