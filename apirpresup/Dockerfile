#STEP 1 CREACION PROYECTO
FROM node:12-alpine3.12 AS build
# Create app directory
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

EXPOSE 4000
CMD [ "node", "src/index.js" ]