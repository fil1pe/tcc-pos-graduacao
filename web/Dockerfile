FROM node:18.16.1
WORKDIR /usr/src/web-app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]