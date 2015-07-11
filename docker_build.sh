#!/bin/bash
echo "Stopping and removing any old gitpun containers."
docker stop gitpun
docker rm gitpun

echo "Building a new classroom/node:v1 image from Dockerfile."
docker build -t gitpun/node:v1 .

echo "Running a new container from the gitpun/node:v1 image and naming the container gitpun."
docker run -d -p 3000:3000 --name gitpun gitpun/node:v1
