FROM node
COPY . /gitpun
WORKDIR /gitpun
RUN /bin/bash -c "npm install nodemon -g && npm install --allow-root"
CMD ["node", "server/server.js"]
