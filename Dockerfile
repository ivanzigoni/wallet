FROM node:16

WORKDIR /usr/src/app/backend

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]