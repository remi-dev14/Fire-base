FROM node:18-alpine

# Dockerfile minimal pour auth-api
WORKDIR /app

# Copier uniquement package.json si présent — optimisation du cache
COPY package*.json ./
RUN if [ -f package.json ]; then npm install --production; fi

# Copier le reste de l'application
COPY . .

EXPOSE 4000
CMD ["node", "index.js"]

# Note: ajouter un index.js / package.json dans services/auth-api pour builder l'image.
