---
name: Hotfix Workflow
description: |
  Automates hotfix creation for staging or production environments.
  Creates a worktree from the correct base branch, presents an interactive
  commit picker, and generates PRs targeting the correct environment branch.
triggers:
  - /hotfix
  - hotfix for staging
  - hotfix for production
  - cherry-pick to staging
  - cherry-pick to production
---

# Hotfix Workflow

Create and deploy hotfixes to staging or production environments with cherry-picked commits from `dev`.

## When to use

- A bug fix on `dev` needs to go to staging or production immediately
- You need to cherry-pick specific commits without deploying everything on `dev`
- Emergency production fixes

## Quick start

```bash
# From any karfur worktree
cd /Users/luis/Code/refugies_info/karfur/dev

# Create a hotfix for staging (client app)
.skills/hotfix/scripts/create-hotfix.sh staging client fix-login-redirect

# Create a hotfix for staging (server app)
.skills/hotfix/scripts/create-hotfix.sh staging server fix-api-timeout

# Create a production hotfix with Linear ticket
.skills/hotfix/scripts/create-hotfix.sh production client KAR-456-critical-fix
```

## Workflow

### 1. Create the hotfix branch and worktree

```bash
.skills/hotfix/scripts/create-hotfix.sh <environment> <app> <description>
```

**Arguments:**
- `environment`: `staging` or `production`
- `app`: `client`, `server`, or `mobile`
- `description`: Branch description (optionally prefixed with ticket like `KAR-123-`)

This will:
- Create branch `hotfix/<environment>/<app>/<description>` from the correct base branch
- Create a worktree at `hotfix/<app>-<description>/`
- Symlink `.envs/` and `.letta/` into the worktree
- **Automatically launch the commit picker**

### Base branches

| Environment | App | Base branch |
|-------------|-----|-------------|
| staging | client | `staging-frontend` |
| staging | server | `staging-backend` |
| staging | mobile | `staging-mobile` |
| production | client | `master-frontend` |
| production | server | `master-backend` |
| production | mobile | `master-mobile` |

### 2. Select a PR or commits to cherry-pick

The commit picker launches automatically after worktree creation. By default it shows **merged PRs**:
- Shows recent PRs merged to `dev`
- Select a PR to cherry-pick all its commits at once
- Uses `gh` CLI for PR data (falls back to commit mode if unavailable)

You can also switch to commit mode with `--commits`:
```bash
.skills/hotfix/scripts/pick-commits.sh --commits
```

### 3. Make additional changes (if needed)

```bash
cd /Users/luis/Code/refugies_info/karfur/hotfix/<app>-<description>

# Run dev server, make fixes, test
pnpm dev:client
pnpm dev:server

# Stage and commit
git add <files>
git commit -m "fix(client): additional hotfix changes"
```

### 4. Create PR

```bash
.skills/hotfix/scripts/pr-hotfix.sh <environment> <app>
```

The script auto-detects the current branch and creates a PR to the correct base.

## Multi-app hotfixes

If your hotfix affects multiple apps (e.g., client AND server), run the workflow once per app:

```bash
# First, create client hotfix
.skills/hotfix/scripts/create-hotfix.sh staging client fix-auth-bug
# ... cherry-pick, test, create PR ...

# Then, create server hotfix  
.skills/hotfix/scripts/create-hotfix.sh staging server fix-auth-bug
# ... cherry-pick, test, create PR ...
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/create-hotfix.sh` | Creates worktree from correct base branch, launches picker |
| `scripts/pick-commits.sh` | Interactive cherry-pick from dev |
| `scripts/pr-hotfix.sh` | Creates PR to correct base branch |

## Notes

- Branch pattern: `hotfix/<environment>/<app>/<description>`
- Worktree path: `hotfix/<app>-<description>/`
- Ticket reference is optional but recommended (e.g., `KAR-123-description`)
- Always test locally before creating the PR
