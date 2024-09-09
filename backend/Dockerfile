FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY server.js ./
COPY config ./config
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes

EXPOSE 5000

CMD ["node", "server.js"]