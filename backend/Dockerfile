FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm rebuild

EXPOSE 8000

CMD ["npm", "start"]