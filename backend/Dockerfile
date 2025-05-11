FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Now copy the application
COPY . .

# Set environment variables
ENV NODE_ENV=production

EXPOSE 8000

CMD ["npm", "start"]