# WARNING: using root folder as current context to make this dockerfile work
FROM node:22.14.0-alpine AS base

  # Update and install system packages
  RUN apk update && apk add --no-cache libc6-compat

#
# Setup tools image with build dependencies
#
FROM base AS tools

  # Enable corepack and prepare pnpm globally
  RUN corepack enable
  RUN corepack prepare pnpm@10.20.0 --activate

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

  # Generate a partial monorepo with a pruned lockfile for a target workspace.
  RUN turbo prune @refugies-info/server --docker

#
# Setup installer image
#
FROM tools AS installer

  # Set working directory
  WORKDIR /app

  # Set Node.js memory limit for build process
  ENV NODE_OPTIONS="--max-old-space-size=4096"

  # First install the dependencies (as they change less often)
  COPY --from=builder /app/out/json/ .

  # Install dependencies
  RUN pnpm install --frozen-lockfile

  # Build the project
  COPY --from=builder /app/out/full/ .

  # Build app using turbo
  RUN pnpm turbo build --filter=@refugies-info/server

#
# Setup runner image (minimal, no build tools)
#
FROM base AS runner

  # Set working directory
  WORKDIR /app

  # Copy built app
  COPY --from=installer /app/apps/server/dist/index.js ./index.js

  CMD ["node", "./index.js"]
