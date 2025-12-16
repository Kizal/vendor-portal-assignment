FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3 py3-setuptools make g++
RUN npm install
RUN npm rebuild sqlite3 --build-from-source

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
