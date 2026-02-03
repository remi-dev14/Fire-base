FROM node:18-alpine

# Dockerfile minimal pour frontend (développement/serveur simple)
WORKDIR /app
COPY package*.json ./
RUN if [ -f package.json ]; then npm install --production; fi
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Si vous préférez builder un bundle statique et le servir avec nginx, changez l'étape CMD.
