#!/bin/bash
echo "Stopping and removing any old web container."
docker stop web
docker rm web

echo "Running a new container from the gitualize/node:v22 image and naming the container web."
docker run -d -p 3000:3000 -v $(pwd):/gitualize --name web --link db gitualize/node:v22
