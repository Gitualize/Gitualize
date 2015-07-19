FROM node
RUN git clone https://github.com/IncognizantDoppelganger/gitpun.git && cd gitpun && npm install -g nodemon && npm install --allow-root
CMD ["nodemon", "gitpun/server/server.js"]
