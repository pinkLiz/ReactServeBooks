📚 ReactServeBooks

CRUD de libros con:
* Backend: Node.js + Express 5 + Sequelize (TypeScript) + PostgreSQL
* Frontend: React + Vite (TypeScript)

Estructura
/server   → API REST (Express + Sequelize + TS)
/client   → SPA (React + Vite + TS)


Requisitos importantes
Node.js v21.7.3

node -v
nvm install 21.7.3
nvm use 21.7.3

Clona el repositorio 
git clone https://github.com/pinkLiz/ReactServeBooks.git

# Backend
cd server
cp .env (Coloca la informacion en el archivo en classworm :3)
npm install (Instalar node modules)
npm run dev  (Levantar proyecto)

# Frontend
cd client
npm install (Instalar node modules)
npm run dev  (Levantar proyecto)

# Pruebas en el backend
npm test
npm run test:coverage
