#!/bin/bash
echo "Stopping and removing any old web containers."
docker stop web
docker rm web

echo "Building a new gitpun/node:v22 image from web_docker/Dockerfile."
docker build -t gitpun/node:v22 ./web_docker

echo "Running a new container from the gitpun/node:v22 image and naming the container web."
docker run -d -p 3000:3000 -v $(pwd):/gitpun --name web --link db gitpun/node:v22
