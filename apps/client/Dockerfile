# WARNING: using root folder as current context to make this dockerfile work
FROM node:24.11.1-alpine AS base

  # Update and install system packages
  RUN apk update && apk add --no-cache libc6-compat

#
# Setup tools image with build dependencies
#
FROM base AS tools

  # Enable corepack and prepare pnpm globally
  RUN corepack enable
  RUN corepack prepare pnpm@10.23.0 --activate

  # Install turbo globally
  ENV PNPM_HOME="/root/.local/share/pnpm"
  ENV PATH="${PNPM_HOME}:${PATH}"
  RUN mkdir -p "$PNPM_HOME" && \
      pnpm add -g turbo

#
# Setup builder image
#
FROM tools AS builder

  # Set working directory
  WORKDIR /app

  # Copy workspace
  COPY . .

  # Make sure an cloudbuild.env file exists for local testing.
  # Otherwise this file is created by cloudbuild.yaml
  RUN touch apps/client/cloudbuild.env

  # Generate a partial monorepo with a pruned lockfile for a target workspace.
  RUN turbo prune @refugies-info/client --docker

#
# Setup installer image
#
FROM tools AS installer

  # Build arguments
  ARG APP_ENV=production
  ARG APP_SERVER_URL=http://localhost:8000
  ARG APP_SITE_URL=http://localhost:3000

  # Set working directory
  WORKDIR /app

  # First install the dependencies (as they change less often)
  COPY --from=builder /app/out/json/ .

  # Install dependencies
  RUN pnpm install --frozen-lockfile

  # Build the project
  COPY --from=builder /app/out/full/ .

  # Copy secrets setup by cloudbuild
  COPY --from=builder /app/apps/client/cloudbuild.env apps/client/.env

  # Add environment variables to the client
  RUN echo "NEXT_PUBLIC_REACT_APP_ENV=${APP_ENV}" >> apps/client/.env
  RUN echo "NEXT_PUBLIC_REACT_APP_SERVER_URL=${APP_SERVER_URL}" >> apps/client/.env
  RUN echo "NEXT_PUBLIC_REACT_APP_SITE_URL=${APP_SITE_URL}" >> apps/client/.env

  # Build app using turbo
  RUN pnpm build:client

#
# Setup runner image (minimal, no build tools)
#
FROM base AS runner

  # Set working directory
  WORKDIR /app

  ENV NEXT_TELEMETRY_DISABLED=1
  ENV NODE_ENV=production

  # Don't run production as root
  RUN addgroup --system --gid 1001 nodejs
  RUN adduser --system --uid 1001 nextjs
  USER nextjs

  # Automatically leverage output traces to reduce image size
  # https://nextjs.org/docs/advanced-features/output-file-tracing
  COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.dist ./

  # Copy node_modules from the installer stage
  # Next.js standalone tracing doesn't properly handle all pnpm workspace dependencies
  # so we copy the full node_modules to ensure runtime dependencies are available
  COPY --from=installer --chown=nextjs:nodejs /app/node_modules ./node_modules

  EXPOSE 3000

  CMD ["node", "apps/client/server.js"]
