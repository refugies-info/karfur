# WARNING: using root folder as current context to make this dockerfile work
# Use a node 16 base image
ARG NODE_VERSION=16
FROM node:${NODE_VERSION}-alpine

# Copy api-types package
WORKDIR /usr/src/api-types
COPY ./api-types ./
RUN npm ci

# Copy package.json and install node modules
WORKDIR /usr/src/app
COPY ./server/package*.json ./
RUN npm ci

# Add app source code
ADD ./server /usr/src/app

# Build app
RUN npm run tsc-prod

# Install berglas
COPY --from=us-docker.pkg.dev/berglas/berglas/berglas:latest /bin/berglas /bin/berglas

ENTRYPOINT exec /bin/berglas exec -- node dist/src/server.js

