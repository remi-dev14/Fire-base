FROM node:18-alpine

# Dockerfile minimal pour backend
WORKDIR /app
COPY package*.json ./
RUN if [ -f package.json ]; then npm install --production; fi
COPY . .
EXPOSE 4100
CMD ["node", "index.js"]

# Remplacer index.js par le point d'entrée réel du backend.
