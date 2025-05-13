FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm rebuild

EXPOSE 3000

CMD ["npm", "start"]