FROM node:22-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "server.js"]
EXPOSE 3000

