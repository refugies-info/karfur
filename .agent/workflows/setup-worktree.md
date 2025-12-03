---
description: Setup a new git worktree with .env files
---

1. Create the worktree
```bash
git worktree add .worktrees/<worktree-name> <branch-name>
```

2. Copy .env files from the main workspace
// turbo
```bash
cp .env .worktrees/<worktree-name>/.env
cp apps/client/.env .worktrees/<worktree-name>/apps/client/.env
cp apps/server/.env .worktrees/<worktree-name>/apps/server/.env
```

3. Install dependencies
```bash
cd .worktrees/<worktree-name>
pnpm install
```
