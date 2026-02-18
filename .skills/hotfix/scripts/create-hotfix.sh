#!/usr/bin/env bash
#
# create-hotfix.sh - Create a hotfix worktree for staging or production
#
# Usage: create-hotfix.sh <environment> <app>
#   environment: staging | production
#   app: client | server | mobile
#
# Example:
#   create-hotfix.sh staging client
#   create-hotfix.sh production server
#
# The script will:
#   1. Show merged PRs to dev for selection
#   2. Create a branch named after the PR (e.g., hotfix/staging/client/PR-123-fix-login)
#   3. Create a worktree and cherry-pick all commits from the PR

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

usage() {
  local exit_code="${1:-1}"
  echo "Usage: $0 <environment> <app>"
  echo ""
  echo "Arguments:"
  echo "  environment   staging | production"
  echo "  app           client | server | mobile"
  echo ""
  echo "Examples:"
  echo "  $0 staging client"
  echo "  $0 production server"
  echo ""
  echo "Base branch mapping:"
  echo "  staging  + client -> staging-frontend"
  echo "  staging  + server -> staging-backend"
  echo "  staging  + mobile -> staging-mobile"
  echo "  production + client -> master-frontend"
  echo "  production + server -> master-backend"
  echo "  production + mobile -> master-mobile"
  exit "$exit_code"
}

# Slugify a string for use in branch names
slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-|-$//g' | cut -c1-50
}

# Handle --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage 0
fi

# Validate arguments
if [[ $# -lt 2 ]]; then
  usage
fi

ENVIRONMENT="$1"
APP="$2"

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  echo -e "${RED}Error: environment must be 'staging' or 'production'${NC}"
  usage
fi

if [[ "$APP" != "client" && "$APP" != "server" && "$APP" != "mobile" ]]; then
  echo -e "${RED}Error: app must be 'client', 'server', or 'mobile'${NC}"
  usage
fi

# Ensure gh CLI is available
if ! command -v gh &>/dev/null; then
  echo -e "${RED}Error: GitHub CLI (gh) is required${NC}"
  echo "Install with: brew install gh"
  exit 1
fi

# Determine workspace root (where .bare lives)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Try to find workspace root by looking for .bare
find_workspace_root() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    if [[ -d "$dir/.bare" ]]; then
      echo "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

# First try from script location, then from pwd
WORKSPACE_ROOT=""
if WORKSPACE_ROOT=$(find_workspace_root "$SCRIPT_DIR"); then
  : # Found from script dir
elif WORKSPACE_ROOT=$(find_workspace_root "$(pwd)"); then
  : # Found from pwd
else
  echo -e "${RED}Error: Could not find workspace root (directory containing .bare)${NC}"
  echo "Please run this script from within a karfur worktree or workspace."
  exit 1
fi

# Determine base branch based on environment and app
get_base_branch() {
  local env="$1"
  local app="$2"
  
  case "$env" in
    staging)
      case "$app" in
        client) echo "staging-frontend" ;;
        server) echo "staging-backend" ;;
        mobile) echo "staging-mobile" ;;
      esac
      ;;
    production)
      case "$app" in
        client) echo "master-frontend" ;;
        server) echo "master-backend" ;;
        mobile) echo "master-mobile" ;;
      esac
      ;;
  esac
}

BASE_BRANCH=$(get_base_branch "$ENVIRONMENT" "$APP")

echo -e "${GREEN}Creating hotfix for ${ENVIRONMENT} ${APP}...${NC}"
echo "  Target branch: ${BASE_BRANCH}"
echo ""

# Fetch latest
echo "Fetching latest from origin..."
git -C "$WORKSPACE_ROOT" fetch origin

# Verify base branch exists
if ! git -C "$WORKSPACE_ROOT" rev-parse "origin/${BASE_BRANCH}" &>/dev/null; then
  echo -e "${RED}Error: Base branch 'origin/${BASE_BRANCH}' not found${NC}"
  exit 1
fi

#
# PR SELECTION
#
echo -e "${GREEN}Fetching recent merged PRs to dev...${NC}"
echo ""

PR_LIST=$(gh pr list --state merged --base dev --limit 20 --json number,title,mergeCommit,author --jq '.[] | "\(.number)\t\(.title)\t\(.mergeCommit.oid // "unknown")\t\(.author.login)"' 2>/dev/null || echo "")

if [[ -z "$PR_LIST" ]]; then
  echo -e "${RED}Error: Could not fetch PRs. Check gh auth status.${NC}"
  exit 1
fi

# Check if we have fzf
USE_FZF=false
if command -v fzf &>/dev/null; then
  USE_FZF=true
fi

if $USE_FZF; then
  echo -e "${GREEN}Select a PR to cherry-pick (Enter to confirm):${NC}"
  echo ""
  
  SELECTED=$(echo "$PR_LIST" | while IFS=$'\t' read -r num title sha author; do
    echo "#${num}  ${title} (@${author})"
  done | fzf --reverse --header="Select a PR to cherry-pick" \
             --preview="gh pr view {1} --json title,body --jq '.title, .body' | head -20" \
             --preview-window=right:40%:wrap || true)
  
  if [[ -z "$SELECTED" ]]; then
    echo -e "${YELLOW}No PR selected. Aborting.${NC}"
    exit 0
  fi
  
  PR_NUM=$(echo "$SELECTED" | grep -oE '^#[0-9]+' | tr -d '#')
  PR_TITLE=$(echo "$SELECTED" | sed -E 's/^#[0-9]+\s+//' | sed -E 's/\s+\(@[^)]+\)$//')
else
  echo -e "${GREEN}Recent merged PRs to dev:${NC}"
  echo ""
  
  mapfile -t PRS < <(echo "$PR_LIST")
  
  idx=1
  for pr in "${PRS[@]}"; do
    IFS=$'\t' read -r num title sha author <<< "$pr"
    printf "  %2d) #%-5s %s (@%s)\n" "$idx" "$num" "$title" "$author"
    ((idx++))
  done
  
  echo ""
  echo -e "${CYAN}Select a PR (1-${#PRS[@]}):${NC}"
  read -r SELECTION
  
  if [[ -z "$SELECTION" ]] || ! [[ "$SELECTION" =~ ^[0-9]+$ ]]; then
    echo -e "${YELLOW}Invalid selection. Aborting.${NC}"
    exit 0
  fi
  
  if [[ "$SELECTION" -lt 1 || "$SELECTION" -gt "${#PRS[@]}" ]]; then
    echo -e "${RED}Selection out of range.${NC}"
    exit 1
  fi
  
  IFS=$'\t' read -r PR_NUM PR_TITLE _ _ <<< "${PRS[$((SELECTION - 1))]}"
fi

echo ""
echo -e "${GREEN}Selected PR #${PR_NUM}: ${PR_TITLE}${NC}"

# Get commits for the PR
echo "Fetching commits for PR #${PR_NUM}..."
PR_COMMITS=$(gh pr view "$PR_NUM" --json commits --jq '.commits[].oid' 2>/dev/null || echo "")

if [[ -z "$PR_COMMITS" ]]; then
  echo -e "${RED}Error: Could not fetch commits for PR #${PR_NUM}${NC}"
  exit 1
fi

mapfile -t COMMIT_ARRAY <<< "$PR_COMMITS"

echo -e "  ${#COMMIT_ARRAY[@]} commit(s) to cherry-pick"
echo ""

# Create branch name from PR
SLUG=$(slugify "$PR_TITLE")
DESCRIPTION="PR-${PR_NUM}-${SLUG}"
BRANCH_NAME="hotfix/${ENVIRONMENT}/${APP}/${DESCRIPTION}"
WORKTREE_PATH="${WORKSPACE_ROOT}/hotfix/${APP}-${DESCRIPTION}"

echo -e "${CYAN}Branch: ${BRANCH_NAME}${NC}"
echo -e "${CYAN}Worktree: ${WORKTREE_PATH}${NC}"
echo ""

# Check if worktree already exists
if [[ -d "$WORKTREE_PATH" ]]; then
  echo -e "${YELLOW}Warning: Worktree already exists at ${WORKTREE_PATH}${NC}"
  echo "Do you want to use the existing worktree and re-run cherry-pick? (y/N)"
  read -r response
  if [[ "$response" =~ ^[Yy]$ ]]; then
    cd "$WORKTREE_PATH"
  else
    echo "Aborting."
    exit 1
  fi
else
  # Create the worktree
  echo "Creating worktree from ${BASE_BRANCH}..."
  mkdir -p "${WORKSPACE_ROOT}/hotfix"
  cd "$WORKSPACE_ROOT"
  
  # Create the branch from the base branch (--no-track to avoid tracking the base)
  git branch --no-track "$BRANCH_NAME" "origin/${BASE_BRANCH}" 2>/dev/null || true
  
  # Create worktree
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
  
  # Link env files
  LINK_SCRIPT="$HOME/.letta/skills/bare-repo-worktrees/scripts/link-envs.sh"
  if [[ -x "$LINK_SCRIPT" ]]; then
    bash "$LINK_SCRIPT" "$WORKSPACE_ROOT" "$WORKTREE_PATH"
  fi
  
  # Link .letta if it exists at workspace root
  if [[ -d "${WORKSPACE_ROOT}/.letta" && ! -e "${WORKTREE_PATH}/.letta" ]]; then
    ln -s "${WORKSPACE_ROOT}/.letta" "${WORKTREE_PATH}/.letta"
    echo "Linked .letta -> ${WORKSPACE_ROOT}/.letta"
  fi
  
  cd "$WORKTREE_PATH"
fi

echo ""
echo -e "${GREEN}Cherry-picking ${#COMMIT_ARRAY[@]} commit(s) from PR #${PR_NUM}...${NC}"

for sha in "${COMMIT_ARRAY[@]}"; do
  echo -e "  Cherry-picking ${CYAN}${sha:0:7}${NC}..."
  if ! git cherry-pick "$sha"; then
    echo ""
    echo -e "${RED}Cherry-pick failed for ${sha}${NC}"
    echo "Resolve conflicts, then run: git cherry-pick --continue"
    echo "Or abort with: git cherry-pick --abort"
    echo ""
    echo "After resolving, create PR with:"
    echo "  .skills/hotfix/scripts/pr-hotfix.sh ${ENVIRONMENT} ${APP}"
    exit 1
  fi
done

echo ""
echo -e "${GREEN}Successfully cherry-picked PR #${PR_NUM}!${NC}"
echo ""
echo -e "${GREEN}Hotfix ready at: ${WORKTREE_PATH}${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  cd ${WORKTREE_PATH}"
echo "  pnpm install   # if needed"
echo "  # Test your changes"
echo "  .skills/hotfix/scripts/pr-hotfix.sh ${ENVIRONMENT} ${APP}"
