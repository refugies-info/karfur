# WARNING: using root folder as current context to make this dockerfile work
FROM node:20.13.1-alpine

# Install pnpm
RUN npm install -g pnpm@9.14.4+sha512.c8180b3fbe4e4bca02c94234717896b5529740a6cbadf19fa78254270403ea2f27d4e1d46a08a0f56c89b63dc8ebfd3ee53326da720273794e6200fcf0d184ab

# Create app directory
WORKDIR /usr/src/app

# Copy workspace
COPY ./ ./

# Install dependencies
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN mkdir -p "$PNPM_HOME" && \
    pnpm add -g turbo && \
    pnpm install --frozen-lockfile

# Delete the pnpm store after installation is done
RUN rm -rf .pnpm-store

# Build app
RUN pnpm build:server

# Install berglas
COPY --from=us-docker.pkg.dev/berglas/berglas/berglas:latest /bin/berglas /bin/berglas

ENTRYPOINT exec /bin/berglas exec -- pnpm start:server
