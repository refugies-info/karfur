---
name: Hotfix Workflow
description: |
  Automates hotfix creation for staging or production environments.
  Select a merged PR to cherry-pick, and the script handles branch creation,
  worktree setup, and PR generation.
triggers:
  - /hotfix
  - hotfix for staging
  - hotfix for production
  - cherry-pick to staging
  - cherry-pick to production
---

# Hotfix Workflow

Create and deploy hotfixes to staging or production by cherry-picking merged PRs from `dev`.

## When to use

- A bug fix merged to `dev` needs to go to staging or production immediately
- You need to cherry-pick a specific PR without deploying everything on `dev`
- Emergency production fixes

## Quick start

```bash
# From any karfur worktree
.skills/hotfix/scripts/create-hotfix.sh staging client
.skills/hotfix/scripts/create-hotfix.sh production server
```

The script will:
1. Show recent merged PRs to `dev`
2. Let you select a PR
3. Create a branch and worktree named after the PR
4. Cherry-pick all commits from that PR

## Workflow

### 1. Create the hotfix

```bash
.skills/hotfix/scripts/create-hotfix.sh <environment> <app>
```

**Arguments:**
- `environment`: `staging` or `production`
- `app`: `client`, `server`, or `mobile`

**What happens:**
- Shows merged PRs to `dev` for selection
- Creates branch: `hotfix/<env>/<app>/PR-<num>-<title-slug>`
- Creates worktree: `hotfix/<app>-PR-<num>-<title-slug>/`
- Cherry-picks all commits from the selected PR

### Base branches

| Environment | App | Target branch |
|-------------|-----|---------------|
| staging | client | `staging-frontend` |
| staging | server | `staging-backend` |
| staging | mobile | `staging-mobile` |
| production | client | `master-frontend` |
| production | server | `master-backend` |
| production | mobile | `master-mobile` |

### 2. Test your changes

```bash
cd /Users/luis/Code/refugies_info/karfur/hotfix/<app>-PR-<num>-<slug>
pnpm install
pnpm dev:client  # or dev:server
```

### 3. Create PR

```bash
.skills/hotfix/scripts/pr-hotfix.sh <environment> <app>
```

## Multi-app hotfixes

If your hotfix affects multiple apps, run once per app:

```bash
.skills/hotfix/scripts/create-hotfix.sh staging client
# ... test, create PR ...

.skills/hotfix/scripts/create-hotfix.sh staging server
# ... test, create PR ...
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/create-hotfix.sh` | PR picker + worktree creation + cherry-pick |
| `scripts/pr-hotfix.sh` | Creates PR to correct base branch |

## Notes

- Always cherry-picks from `dev` (for both staging and production)
- Branch naming: `hotfix/<env>/<app>/PR-<num>-<slug>`
- Worktree path: `hotfix/<app>-PR-<num>-<slug>/`
