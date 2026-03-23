# Working with Git Worktrees

This repository uses a **bare repo + worktree** setup to support parallel development — multiple branches can be checked out simultaneously, each in its own directory, without interfering with each other.

---

## Repository Layout

```
karfur/
├── .bare/              # Git data (bare clone — not a working directory)
├── .git                # Pointer file → .bare (makes standard git tools work)
└── worktrees/          # ALL worktrees live here — primary and feature branches
    ├── dev/            # Dev branch — source of truth for shared files
    ├── feat-my-feature/
    └── fix-some-bug/
```

`worktrees/dev/` is a regular checkout of the `dev` branch. **Never commit work directly to it** — it's a stable reference point. Create a worktree for every piece of work.

---

## Prerequisites

### 1. Worktrunk

Install [worktrunk](https://worktrunk.dev) — a CLI that makes worktrees as easy as branches:

```bash
# macOS (Homebrew)
brew install worktrunk && wt config shell install

# Linux / Windows / other — see https://worktrunk.dev for installation options
```

Shell integration is required for `wt switch` to change directories automatically.

> **Warning (Linux/Homebrew)**: On Linux, `wt config shell install` can incorrectly append the brew shellenv line to `~/.config/worktrunk/config.toml`, corrupting it. If you see a TOML parse error mentioning `shellenv`, fix it with:
> ```bash
> sed -i '/shellenv/d' ~/.config/worktrunk/config.toml
> ```

### 2. Worktrunk user config

Configure worktrunk to place all worktrees (including `dev`) inside the `worktrees/` directory:

```toml
# ~/.config/worktrunk/config.toml
[projects."github.com/refugies-info/karfur"]
worktree-path = "worktrees/{{ branch | sanitize }}"
```

Create the file if it doesn't exist: `wt config create` then add the `[projects]` section above.

---

## Initial Clone

```bash
# 1. Create the workspace directory and bare clone into it
git clone --bare --single-branch git@github.com:refugies-info/karfur.git karfur/.git
cd karfur

# 2. Create the dev worktree (branch already exists after bare clone)
wt switch dev

# 3. Install dependencies
cd dev && pnpm install
```

`--single-branch` avoids creating local tracking branches for every remote branch (this repo has many stale remote branches). Remote branches remain fully accessible via `git fetch`.

Then set up your `.env` files (see each app's `.env.example` for required variables):

```bash
cp apps/client/.env.example apps/client/.env
cp apps/server/.env.example apps/server/.env
# Fill in real values
```

---

## Daily Workflow

### Start work on a new branch

```bash
wt switch --create feat/my-feature
```

Worktrunk automatically:
1. Creates the branch and worktree at `worktrees/feat-my-feature/`
2. Runs `pnpm install` (post-create hook)
3. Copies gitignored files from `dev/` — `.env*`, `.envrc`, `.turbo/`, `.letta/` (post-start hook)

No manual dependency installation or `.env` copying needed.

### List all worktrees

```bash
wt list
```

### Switch between worktrees

```bash
wt switch feat/my-feature
wt switch -     # previous worktree (like cd -)
wt switch ^     # dev worktree
```

### Clean up after a PR is merged

```bash
# Switch OUT of the worktree first — wt remove can't remove the worktree you're in
wt switch ^                     # switch to dev
wt remove feat/my-feature       # then remove
wt step prune                   # remove all merged worktrees at once
```

### Update dev

```bash
wt switch ^ && git pull
```

---

## How `.env` and Build Caches Are Shared

When a new worktree is created, `wt step copy-ignored` (configured as a post-start hook in `.config/wt.toml`) copies gitignored files from `dev/`.

`.config/wt.toml` is a **project-level** config committed to the repo, distinct from your personal `~/.config/worktrunk/config.toml`. Run `wt hook show` to inspect active hooks.

The `.worktreeinclude` file in the repo root controls what gets copied:

```
.env
.envrc
.turbo/
.letta/
```

A few intentional omissions vs other repos:

- **`node_modules/` is not copied** — the `pnpm install` post-create hook handles this correctly and avoids pnpm store conflicts.
- **`.next/` is not copied** — Next.js incremental cache is branch-specific; copying from `dev` causes stale or incorrect builds on feature branches.

**Edit `.env` files in `dev/`** — they are the canonical source. Each new worktree gets a fresh copy on creation.

---

## Why bare repo?

A standard `git clone` gives you one working directory. Switching branches means stashing, switching, losing context. The bare repo pattern gives each branch its own directory — `feat/auth` and `fix/bug` coexist side by side with no interference. This is especially useful when running multiple AI coding agents in parallel on different features simultaneously.
