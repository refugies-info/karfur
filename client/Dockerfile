FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
