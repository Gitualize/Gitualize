FROM node
ENV IS_DOCKER_CONTAINER true
CMD git clone https://github.com/IncognizantDoppelganger/gitpun.git && cd gitpun && npm install -g nodemon gulp && npm install --allow-root && gulp browserifyWatchless && nodemon gitpun/server/server.js
