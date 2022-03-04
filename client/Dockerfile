FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:16-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED 1
ARG APP_SERVER_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN echo "NEXT_PUBLIC_REACT_APP_SERVER_URL = ${APP_SERVER_URL}" >> .env
RUN npm run build

FROM node:16-alpine AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app

COPY --from=builder /app/next*.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "start"]
