# WARNING: using root folder as current context to make this dockerfile work
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY ./client/package*.json ./
RUN npm ci --legacy-peer-deps

FROM node:16-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ARG APP_ENV=production
ARG APP_SERVER_URL=http://localhost:8000
ARG APP_SITE_URL=http://localhost:3000
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY ./client .
RUN echo "NEXT_PUBLIC_REACT_APP_ENV = ${APP_ENV}" >> .env
RUN echo "NEXT_PUBLIC_REACT_APP_SERVER_URL = ${APP_SERVER_URL}" >> .env
RUN echo "NEXT_PUBLIC_REACT_APP_SITE_URL = ${APP_SITE_URL}" >> .env
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
