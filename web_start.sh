#!/bin/bash
echo "Stopping and removing any old web container."
docker stop web
docker rm web

echo "Running a new container from the gitpun/node:v22 image and naming the container web."
docker run -d -p 3000:3000 -v $(pwd):/gitpun --name web --link db gitpun/node:v22
