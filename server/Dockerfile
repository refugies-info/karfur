# WARNING: using root folder as current context to make this dockerfile work
FROM node:20.13.1-alpine

# Install yarn
RUN npm install --force --global yarn@1.22.22

# Copy package.json and install node modules
WORKDIR /usr/src/app

# Copy workspace config
COPY ./ ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Build app
RUN yarn build:server

# Install berglas
COPY --from=us-docker.pkg.dev/berglas/berglas/berglas:latest /bin/berglas /bin/berglas

ENTRYPOINT exec /bin/berglas exec -- node dist/src/server.js
