# Utilise une version Node officielle
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers
COPY . .

# Expose le port
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]
