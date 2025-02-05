# Utilise une version officielle de Node.js
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Installe les outils nécessaires pour la compilation de modules natifs
RUN apt-get update && apt-get install -y build-essential

# Copie uniquement package.json et package-lock.json (pour optimiser le cache)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers
COPY . .

# Expose le port
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]
