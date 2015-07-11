#!/bin/bash
echo "Stopping and removing any old gitpun container."
docker stop gitpun
docker rm gitpun

echo "Running a new container from the gitpun/node:v1 image and naming the container gitpun."
docker run -d -p 3000:3000 --name gitpun gitpun/node:v1
