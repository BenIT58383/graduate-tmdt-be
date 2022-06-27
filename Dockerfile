FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 80 443 8081

CMD ["npm", "start"]
