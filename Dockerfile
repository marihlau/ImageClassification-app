FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN yarn install --production
RUN npm install jsonwebtoken
COPY . .
CMD ["node", "server.js"]
EXPOSE 3000

