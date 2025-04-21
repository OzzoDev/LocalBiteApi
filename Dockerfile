FROM node:20-alpine

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

CMD ["nodemon", "--legacy-watch", "server.js"]
