FROM node:13-alpine

COPY ./package*.json /back/

WORKDIR /back

RUN npm install

COPY . .

RUN npm install --silent

CMD ["npm", "start"]
