#!/bin/bash

# Define environment variables
DEV_DB_HOST=localhost
DEV_DB_PORT=27017
DEV_DB_NAME=eCommerceDEV

# Run MongoDB container
docker run -d \
  --name mongodb \
  -e MONGO_INITDB_DATABASE=${DEV_DB_NAME} \
  -p ${DEV_DB_PORT}:${DEV_DB_PORT} \
  mongo
