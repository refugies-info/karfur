# WARNING: using root folder as current context to make this dockerfile work
FROM node:22.13.1-alpine

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Create app directory
WORKDIR /usr/src/app

# Copy workspace
COPY ./ ./

# Install dependencies
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN mkdir -p "$PNPM_HOME" && \
    pnpm install --frozen-lockfile && \
    pnpm add -g turbo

# Delete the pnpm store after installation is done
RUN rm -rf .pnpm-store

# Build app using turbo
RUN pnpm turbo build --filter=@refugies-info/server

# Install berglas
# COPY --from=us-docker.pkg.dev/berglas/berglas/berglas:2.0.7 /bin/berglas /bin/berglas

# ENTRYPOINT ["/bin/berglas", "exec", "--", "pnpm", "start:server"]

ENTRYPOINT ["env"]
