#!/bin/bash
echo "Stopping and removing any old db container."
docker stop db
docker rm db

echo "Running a new container from the postgres image and naming the container db."
docker run -d -p 5432:5432 --name db postgres
