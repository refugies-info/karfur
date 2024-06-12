# WARNING: using root folder as current context to make this dockerfile work
FROM node:20.13.1-alpine

# Copy package.json and install node modules
WORKDIR /usr/src/app
COPY ./server/package*.json ./
RUN npm ci

# Add app source code
ADD ./server /usr/src/app

# Build app
RUN npm run tsc

# Install berglas
COPY --from=us-docker.pkg.dev/berglas/berglas/berglas:latest /bin/berglas /bin/berglas

ENTRYPOINT exec /bin/berglas exec -- node dist/src/server.js
