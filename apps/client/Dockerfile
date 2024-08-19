# WARNING: using root folder as current context to make this dockerfile work
FROM node:20.13.1-alpine AS deps
RUN apk add --no-cache libc6-compat

# Install yarn
RUN npm install --force --global yarn@1.22.22

# Create app directory
WORKDIR /usr/src/app

# Copy workspace
COPY ./ ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Delete the cache folder after `yarn install` is done.
RUN rm -rf .yarn/cache

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ARG APP_ENV=production
ARG APP_SERVER_URL=http://localhost:8000
ARG APP_SITE_URL=http://localhost:3000

# Add environment variables to the client
# Careful, the cloud build script creates a .env file in the client folder
# before this step occurs
RUN echo "NEXT_PUBLIC_REACT_APP_ENV = ${APP_ENV}" >> ./apps/client/.env
RUN echo "NEXT_PUBLIC_REACT_APP_SERVER_URL = ${APP_SERVER_URL}" >> ./apps/client/.env
RUN echo "NEXT_PUBLIC_REACT_APP_SITE_URL = ${APP_SITE_URL}" >> ./apps/client/.env

RUN yarn build:client

EXPOSE 3000

CMD ["yarn", "start:client"]
