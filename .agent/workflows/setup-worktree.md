---
description: Setup a new git worktree with .env files
---

1. Create the worktree
```bash
git worktree add .worktrees/<worktree-name> <branch-name>
```

2. Copy .env files from the main workspace
<!-- turbo -->
```bash
rsync -R .env apps/client/.env apps/server/.env .worktrees/<worktree-name>/
```

3. Install dependencies
```bash
cd .worktrees/<worktree-name>
pnpm install
```
