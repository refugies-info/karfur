---
description: Essential pnpm/turbo commands for development, building, testing, and deployment. Quick reference for daily workflow.
limit: 20000
---

## Development

```bash
pnpm dev                    # Start all services
pnpm dev:client            # Start client + UI
pnpm dev:server            # Start server
pnpm dev:mobile            # Start mobile + server
pnpm dev:storybook         # Start Storybook + UI
```

## Building

```bash
pnpm build                 # Build all
pnpm build:client          # Build client (requires dev server running for prerendering)
pnpm build:server          # Build server only
pnpm build:storybook       # Build Storybook
```

## Testing

```bash
pnpm test                    # Run all tests
pnpm test:client             # Test client
pnpm test:server             # Test server
pnpm test:mobile             # Test mobile
pnpm test:client -- --watch  # Watch mode
```

## Code Quality

```bash
pnpm lint                  # Lint all (excludes mobile)
pnpm lint:client           # Lint client only
pnpm lint:server           # Lint server only
pnpm lint:style            # Lint CSS/SCSS with stylelint
pnpm check:types           # Type check all packages
pnpm format                # Format all code with Biome
pnpm knip                  # Detect unused files/exports
```

## Cleanup

```bash
pnpm clean:modules         # Remove all node_modules
pnpm clean:cache           # Clear build artifacts (.turbo, .next, dist, etc.)
pnpm clean:branches        # Prune deleted remote branches
```

## Mobile (Expo EAS)

```bash
# Development builds
pnpm eas:build:android     # Build Android dev
pnpm eas:build:ios         # Build iOS dev

# Staging
pnpm eas:build:staging     # Build both platforms for staging
pnpm eas:update            # Push OTA update to staging

# Production
pnpm eas:submit:android    # Submit to Play Store
pnpm eas:submit:ios        # Submit to App Store
```

## Release PRs

```bash
# Client releases
pnpm pr:stg:client         # Create PR: dev → staging-frontend
pnpm pr:prod:client        # Create PR: staging-frontend → master-frontend

# Server releases
pnpm pr:stg:server         # Create PR: dev → staging-backend
pnpm pr:prod:server        # Create PR: staging-backend → master-backend

# Mobile releases
pnpm pr:stg:mobile         # Create PR: dev → staging-mobile
pnpm pr:prod:mobile        # Create PR: staging-mobile → master-mobile
```

## Database

```bash
pnpm migrate               # Run database migrations
```

## Other

```bash
pnpm update-icons          # Update DSFR icons
pnpm storybook:publish     # Publish Storybook
```