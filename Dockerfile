FROM node:23-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3123

CMD ["node", "app.js"] 