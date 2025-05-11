FROM node:20

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Now copy the application
COPY . .

EXPOSE 8000

CMD ["npm", "start"]