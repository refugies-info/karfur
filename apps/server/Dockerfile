# WARNING: using root folder as current context to make this dockerfile work
FROM node:22.14.0-alpine AS base

#
# Setup builder image
#
FROM base AS builder

  # Update and install system packages
  RUN apk update && apk add --no-cache libc6-compat

  # Set working directory
  WORKDIR /app

  # Install pnpm
  RUN npm install -g pnpm@10.14.0

  # Install turbo
  ENV PNPM_HOME="/root/.local/share/pnpm"
  ENV PATH="${PNPM_HOME}:${PATH}"
  RUN mkdir -p "$PNPM_HOME" && \
      pnpm add -g turbo

  # Copy workspace
  COPY . .

  # Generate a partial monorepo with a pruned lockfile for a target workspace.
  RUN turbo prune @refugies-info/server --docker

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

  # Build app using turbo
  RUN pnpm turbo build --filter=@refugies-info/server

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

  # Copy built app
  COPY --from=installer /app/apps/server/dist/index.js ./index.js

  # Install berglas
  COPY --from=us-docker.pkg.dev/berglas/berglas/berglas:2.0.7 /bin/berglas /bin/berglas

  ENTRYPOINT ["/bin/berglas", "exec", "--", "node", "./index.js"]
