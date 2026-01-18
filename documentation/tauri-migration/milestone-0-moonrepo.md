# Milestone 0: Turborepo → Moonrepo Migration

## Overview

This document details the migration from Turborepo to Moonrepo for the Réfugiés.info monorepo. This migration is a prerequisite for Tauri mobile development, enabling polyglot support (TypeScript + Rust).

## Rationale

| Feature | Turborepo | Moonrepo |
|---------|-----------|----------|
| Primary Language | JavaScript/TypeScript | Rust, TypeScript, Go, etc. |
| Rust Support | ❌ Manual | ✅ First-class |
| Task Orchestration | ✅ Good | ✅ Excellent |
| Caching | ✅ Remote + Local | ✅ Remote + Local |
| Migration Path | - | ✅ `moon ext migrate-turborepo` |

## Impact Analysis

### CI/CD Workflows (6 files)

| Workflow | Turbo Usage | Required Changes |
|----------|-------------|------------------|
| `checks.yaml` | `turbo build`, `turbo test` | Replace with `moon run` |
| `chromatic.yaml` | `pnpm add -g turbo` | Remove, use `moon` |
| `build_mobile_staging.yaml` | `pnpm add -g turbo` | Remove (unused) |
| `build_mobile_prod.yaml` | `pnpm add -g turbo` (likely) | Remove (unused) |
| `migrate_staging.yaml` | `pnpm add -g turbo` | Remove (unused) |
| `migrate_production.yaml` | `pnpm add -g turbo` (likely) | Remove (unused) |

> [!NOTE]
> Several workflows install turbo globally but don't actually use it for their primary commands. These can simply have the turbo installation removed.

### Root package.json Scripts

**20+ scripts use `turbo` directly:**

```
build, build:client, build:server, build:storybook
check:types, check:types:*
dev, dev:ui, dev:client, dev:server, dev:mobile, dev:storybook
test, test:client, test:server, test:mobile
lint, lint:api-types, lint:client, lint:server, lint:mobile
format
```

**Scripts that DON'T use turbo (no changes needed):**
```
clean:*, start:*, pr:*, eas:*, migrate, storybook:publish, knip
```

### Documentation

| File | Impact |
|------|--------|
| `README.md` | No turbo references - no changes needed |
| `CONTRIBUTING.md` | No turbo references - no changes needed |
| `documentation/*` | Needs review for any turbo mentions |

### Developer Experience

| Item | Impact |
|------|--------|
| Husky hooks | No turbo - uses `lint-staged` with `biome` |
| Local dev commands | Same syntax: `pnpm dev:client` → still works |
| IDE integration | Moonrepo has VS Code extension |

## Prerequisites

1. **Install Moonrepo CLI via proto** (our standard tool manager)
   ```bash
   proto install moon
   ```

2. **Verify Rust is installed** (already managed via proto)
   ```bash
   rustc --version
   ```

## Implementation Steps

### Step 1: Initialize Moonrepo

```bash
cd /path/to/karfur
moon init --yes
```

This creates:
- `.moon/workspace.yml`
- `.moon/toolchain.yml`

### Step 2: Configure Workspace

**[NEW] `.moon/workspace.yml`**
```yaml
$schema: 'https://moonrepo.dev/schemas/workspace.json'

projects:
  - 'apps/*'
  - 'packages/*'

vcs:
  manager: 'git'
  defaultBranch: 'dev'
  remoteCandidates:
    - 'origin'

# Enable Turborepo migration extension
extensions:
  migrate-turborepo:
    plugin: 'https://github.com/moonrepo/moon-extensions/releases/download/migrate_turborepo-v0.1.0/migrate_turborepo.wasm'
```

### Step 3: Configure Toolchain

**[NEW] `.moon/toolchain.yml`**
```yaml
$schema: 'https://moonrepo.dev/schemas/toolchain.json'

node:
  version: '24.11.1'
  packageManager: 'pnpm'
  pnpm:
    version: '10.26.1'
  inferTasksFromScripts: true

# Rust support for Tauri (Milestone 1+)
rust:
  version: 'stable'
  components:
    - 'clippy'
    - 'rustfmt'
```

### Step 4: Run Migration

```bash
moon ext migrate-turborepo
```

This converts `turbo.json` → `.moon/tasks/*.yml` and individual `moon.yml` files.

### Step 5: Verify Migration

```bash
# Test build
moon run :build

# Test dev (should work same as before)
moon run client:dev server:dev

# Test type checking
moon run :check:types
```

### Step 6: Update CI Workflows

**[MODIFY] `.github/workflows/checks.yaml`**
```diff
      - name: Install Dependencies
        run: |
-         pnpm add -g turbo
+         curl -fsSL https://moonrepo.dev/install/moon.sh | bash
          pnpm install --frozen-lockfile

      - name: Build UI Package
-       run: turbo build --filter=@refugies-info/ui
+       run: moon run ui:build

      - name: Lint and Check Types
        run: pnpm lint check:types

      - name: Test (except mobile for now because flaky)
-       run: turbo test --filter=!@refugies-info/mobile
+       run: moon run :test --query "project!=mobile"
```

### Step 7: Update Root package.json

**[MODIFY] `package.json`** (partial)
```diff
  "scripts": {
-   "build": "turbo build",
+   "build": "moon run :build",
-   "dev": "turbo dev",
+   "dev": "moon run :dev",
-   "test": "turbo test",
+   "test": "moon run :test",
-   "check:types": "turbo check:types",
+   "check:types": "moon run :check:types",
    ...
  },
  "devDependencies": {
-   "turbo": "2.6.0",
    ...
  }
```

### Step 8: Cleanup

```bash
# Remove turbo files
rm turbo.json
rm -rf .turbo

# Remove turbo from dependencies
pnpm remove turbo

# Update lockfile
pnpm install
```

## Rollback Plan

If issues arise:

1. Revert `.moon/` directory removal
2. Restore `turbo.json` from git
3. Revert package.json changes
4. Restore CI workflow changes
5. Run `pnpm add -D turbo`

## Verification Checklist

- [ ] `moon run :build` completes successfully
- [ ] `moon run :dev` starts all dev servers
- [ ] `moon run :test` runs all tests
- [ ] `moon run :lint` passes
- [ ] CI workflow `checks.yaml` passes
- [ ] CI workflow `chromatic.yaml` passes
- [ ] Mobile builds still work (even though they don't use turbo directly)
- [ ] Husky pre-commit hooks still work

## Unintended Consequences & Mitigations

### 1. Learning Curve
**Risk:** Developers unfamiliar with Moonrepo syntax
**Mitigation:** Wrapper scripts in package.json maintain same commands (`pnpm dev:client`)

### 2. CI Cache Invalidation
**Risk:** First runs after migration will be slower (no cache)
**Mitigation:** Moonrepo supports remote caching; can set up after migration

### 3. Filter Syntax Changes
**Risk:** `--filter=@refugies-info/ui` becomes different
**Mitigation:** Moonrepo uses `--query` with different syntax; document changes

## Timeline

| Task | Estimate |
|------|----------|
| Install & configure Moonrepo | 1 hour |
| Run migration command | 15 min |
| Verify local builds | 1 hour |
| Update CI workflows | 2 hours |
| Update package.json scripts | 1 hour |
| Testing & validation | 2 hours |
| Documentation updates | 1 hour |

**Total: ~1 day**

## Success Criteria

1. All existing `pnpm` commands work identically
2. CI passes on all workflows
3. No increase in build times
4. Rust toolchain configurable for future Tauri work
