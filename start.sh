#!/bin/sh

# echo -e \
# "VITE_REACT_APP_BASE_URL=http://backend:8000\n\
# VITE_REACT_APP_WS_URL=ws://backend:8000" >> ./frontend/telegraph/.env

node ./replace.env.mjs
docker-compose -f ./docker-compose.local.yml up --build

rm ./docker-compose.local.yml
# rm ./frontend/telegraph/.env
