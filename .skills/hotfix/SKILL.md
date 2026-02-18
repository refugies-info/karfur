---
name: Hotfix Workflow
description: |
  Automates hotfix creation for staging or production environments.
  Creates a worktree, presents an interactive list of recent dev commits to cherry-pick,
  and generates PRs targeting the correct environment branch.
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
# From the karfur workspace root
cd /Users/luis/Code/refugies_info/karfur

# Create a hotfix for staging
.skills/hotfix/scripts/create-hotfix.sh staging "fix-login-redirect"

# Or with a Linear ticket
.skills/hotfix/scripts/create-hotfix.sh staging "KAR-456-fix-login-redirect"

# Create a hotfix for production
.skills/hotfix/scripts/create-hotfix.sh production "critical-payment-fix"
```

## Workflow

### 1. Create the hotfix branch and worktree

```bash
.skills/hotfix/scripts/create-hotfix.sh <environment> <description>
```

**Arguments:**
- `environment`: `staging` or `production`
- `description`: Branch description (optionally prefixed with ticket like `KAR-123-`)

This will:
- Create branch `hotfix/<environment>/<description>`
- Create a worktree at `hotfix/<description>/`
- Symlink `.envs/` and `.letta/` into the worktree

### 2. Cherry-pick commits from dev

```bash
cd /Users/luis/Code/refugies_info/karfur/hotfix/<description>
.skills/hotfix/scripts/pick-commits.sh
```

This will:
- Show recent commits on `dev` in an interactive list
- Let you select one or more commits (comma-separated)
- Cherry-pick them into your hotfix branch

### 3. Make additional changes (if needed)

```bash
# Run dev server, make fixes, test
pnpm dev:client
pnpm dev:server

# Stage and commit
git add <files>
git commit -m "fix(client): additional hotfix changes"
```

### 4. Create PR(s)

```bash
.skills/hotfix/scripts/pr-hotfix.sh <environment> <app>
```

**Arguments:**
- `environment`: `staging` or `production`
- `app`: `client`, `server`, or `mobile`

**Target branches:**

| Environment | App | Base branch |
|-------------|-----|-------------|
| staging | client | `staging-frontend` |
| staging | server | `staging-backend` |
| staging | mobile | `staging-mobile` |
| production | client | `master-frontend` |
| production | server | `master-backend` |
| production | mobile | `master-mobile` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/create-hotfix.sh` | Creates worktree and hotfix branch |
| `scripts/pick-commits.sh` | Interactive cherry-pick from dev |
| `scripts/pr-hotfix.sh` | Creates PR to correct base branch |

## Notes

- Branch pattern: `hotfix/<staging|production>/<description>`
- Ticket reference is optional but recommended (e.g., `KAR-123-description`)
- Always test locally before creating the PR
- For multi-app hotfixes, create separate PRs for each app
