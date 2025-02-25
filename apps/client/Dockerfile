# WARNING: using root folder as current context to make this dockerfile work
FROM node:22.13.1-alpine AS base

#
# Setup builder image
#
FROM base AS builder

# Update and install system packages
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Install turbo
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN mkdir -p "$PNPM_HOME" && \
    pnpm add -g turbo

# Copy workspace
COPY . .

# Rename apps/client/env.cloudbuild to .env (see cloudbuild.yaml)
RUN mv apps/client/env.cloudbuild apps/client/.env 2>/dev/null || true

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune @refugies-info/client --docker

#
# Setup installer image
#
FROM base AS installer

# Update and install system packages
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Install turbo
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN mkdir -p "$PNPM_HOME" && \
    pnpm add -g turbo

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .

# Add environment variables to the client
# Careful, the cloud build script creates a .env file in the client folder
# before this step occurs
# but create a .env file in the current folder if it doesn't exist
RUN touch apps/client/.env
RUN echo "NEXT_PUBLIC_REACT_APP_ENV = ${APP_ENV}" >> apps/client/.env
RUN echo "NEXT_PUBLIC_REACT_APP_SERVER_URL = ${APP_SERVER_URL}" >> apps/client/.env
RUN echo "NEXT_PUBLIC_REACT_APP_SITE_URL = ${APP_SITE_URL}" >> apps/client/.env

# Build app using turbo
RUN pnpm turbo build --filter=@refugies-info/client

#
# Setup runner image
#
FROM base AS runner

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Install turbo
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN mkdir -p "$PNPM_HOME" && \
    pnpm add -g turbo

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ARG APP_ENV=production
ARG APP_SERVER_URL=http://localhost:8000
ARG APP_SITE_URL=http://localhost:3000

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public

EXPOSE 3000

CMD node apps/client/server.js
