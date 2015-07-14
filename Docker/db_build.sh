#!/bin/bash
echo "Stopping and removing any old db containers."
docker stop db
docker rm db

echo "Building a new postgres image from db_docker/Dockerfile."
docker build -t postgres ./db_docker

echo "Running a new container from the postgres image and naming the container db."
docker run -d -p 5432:5432 --name db postgres
