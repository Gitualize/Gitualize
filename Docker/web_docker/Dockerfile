FROM node
ENV IS_DOCKER_CONTAINER true
CMD git clone https://github.com/Gitualize/Gitualize.git && cd Gitualize && npm install -g nodemon gulp casperjs@1.1.0-beta3 phantomjs && npm install --allow-root && gulp browserifyWatchless && nodemon server/server.js
