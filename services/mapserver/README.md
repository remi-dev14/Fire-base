# Serveur de tuiles / mapserver

Ce dossier est un emplacement pour stocker des tuiles OSM offline (format /z/x/y) ou pour ajouter un Dockerfile spécifique
si vous utilisez un serveur de tuiles (tileserver-gl, tileserver-php, etc.).

Actuellement `docker-compose.yml` utilise `nginx:alpine` pour servir statiquement le contenu du dossier `tiles` à la racine de ce dossier.

Pour ajouter des tuiles offline :

1. Créez `services/mapserver/tiles` et placez-y la hiérarchie z/x/y.html/png
2. Lancer `docker compose up` et accéder à `http://localhost:8081/{z}/{x}/{y}.png`
