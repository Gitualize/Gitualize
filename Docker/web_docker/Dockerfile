FROM node
ENV IS_DOCKER_CONTAINER true
CMD git clone https://github.com/IncognizantDoppelganger/gitpun.git && cd gitpun && npm install -g nodemon gulp casperjs@1.1.0-beta3 phantomjs && npm install --allow-root && gulp browserifyWatchless && nodemon server/server.js
