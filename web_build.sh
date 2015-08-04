#!/bin/bash
echo "Stopping and removing any old web containers."
docker stop web
docker rm web

echo "Building a new gitualize/node:v22 image from web_docker/Dockerfile."
docker build -t gitualize/node:v22 ./Docker/web_docker

echo "Running a new container from the gitualize/node:v22 image and naming the container web."
docker run -d -p 3000:3000 -v $(pwd):/gitualize --name web --link db gitualize/node:v22
