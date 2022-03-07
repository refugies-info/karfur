FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:16-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ARG APP_SERVER_URL=http://localhost:8000
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN echo "NEXT_PUBLIC_REACT_APP_SERVER_URL = ${APP_SERVER_URL}" >> .env
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
