#!/usr/bin/env bash
#
# create-hotfix.sh - Create a hotfix worktree for staging or production
#
# Usage: create-hotfix.sh <environment> <description>
#   environment: staging | production
#   description: branch description (e.g., "fix-login" or "KAR-123-fix-login")
#
# Example:
#   create-hotfix.sh staging fix-login-redirect
#   create-hotfix.sh production KAR-456-critical-payment-fix

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

usage() {
  local exit_code="${1:-1}"
  echo "Usage: $0 <environment> <description>"
  echo ""
  echo "Arguments:"
  echo "  environment   staging | production"
  echo "  description   Branch description (e.g., 'fix-login' or 'KAR-123-fix-login')"
  echo ""
  echo "Examples:"
  echo "  $0 staging fix-login-redirect"
  echo "  $0 production KAR-456-critical-payment-fix"
  exit "$exit_code"
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
DESCRIPTION="$2"

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  echo -e "${RED}Error: environment must be 'staging' or 'production'${NC}"
  usage
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

BRANCH_NAME="hotfix/${ENVIRONMENT}/${DESCRIPTION}"
WORKTREE_PATH="${WORKSPACE_ROOT}/hotfix/${DESCRIPTION}"

echo -e "${GREEN}Creating hotfix worktree...${NC}"
echo "  Environment: ${ENVIRONMENT}"
echo "  Branch:      ${BRANCH_NAME}"
echo "  Worktree:    ${WORKTREE_PATH}"
echo ""

# Check if worktree already exists
if [[ -d "$WORKTREE_PATH" ]]; then
  echo -e "${YELLOW}Warning: Worktree already exists at ${WORKTREE_PATH}${NC}"
  echo "Do you want to use the existing worktree? (y/N)"
  read -r response
  if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Using existing worktree.${NC}"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "  cd ${WORKTREE_PATH}"
    echo "  .skills/hotfix/scripts/pick-commits.sh   # Cherry-pick commits from dev"
    exit 0
  else
    echo "Aborting."
    exit 1
  fi
fi

# Fetch latest from origin
echo "Fetching latest from origin..."
git -C "$WORKSPACE_ROOT" fetch origin

# Determine base branch for the hotfix
# For staging: branch from the staging branch
# For production: branch from the master/production branch
if [[ "$ENVIRONMENT" == "staging" ]]; then
  # Use dev as base - the commits we cherry-pick are already on dev
  BASE_BRANCH="dev"
else
  # For production, also start from dev and cherry-pick
  BASE_BRANCH="dev"
fi

# Create the worktree using the bare-repo-worktrees script if available
NEW_WORKTREE_SCRIPT="$HOME/.letta/skills/bare-repo-worktrees/scripts/new-worktree.sh"

if [[ -x "$NEW_WORKTREE_SCRIPT" ]]; then
  echo "Using bare-repo-worktrees script..."
  # The script expects: new-worktree.sh <branch-name> <base-branch>
  # But it creates worktree at workspace_root/<branch-name>
  # We need worktree at workspace_root/hotfix/<description>
  
  # Create hotfix directory if it doesn't exist
  mkdir -p "${WORKSPACE_ROOT}/hotfix"
  
  cd "$WORKSPACE_ROOT"
  
  # Create the branch first
  git branch "$BRANCH_NAME" "origin/${BASE_BRANCH}" 2>/dev/null || true
  
  # Create worktree manually since the path structure differs
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
  
  # Link env files
  LINK_SCRIPT="$HOME/.letta/skills/bare-repo-worktrees/scripts/link-envs.sh"
  if [[ -x "$LINK_SCRIPT" ]]; then
    bash "$LINK_SCRIPT" "$WORKTREE_PATH"
  fi
  
  # Link .letta if it exists at workspace root
  if [[ -d "${WORKSPACE_ROOT}/.letta" && ! -e "${WORKTREE_PATH}/.letta" ]]; then
    ln -s "${WORKSPACE_ROOT}/.letta" "${WORKTREE_PATH}/.letta"
    echo "Linked .letta -> ${WORKSPACE_ROOT}/.letta"
  fi
else
  # Fallback: create worktree manually
  echo "Creating worktree manually..."
  
  mkdir -p "${WORKSPACE_ROOT}/hotfix"
  cd "$WORKSPACE_ROOT"
  
  # Create branch and worktree
  git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "origin/${BASE_BRANCH}"
  
  echo -e "${YELLOW}Note: You may need to manually symlink .envs/ files${NC}"
fi

echo ""
echo -e "${GREEN}Hotfix worktree created successfully!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  cd ${WORKTREE_PATH}"
echo "  pnpm install"
echo "  .skills/hotfix/scripts/pick-commits.sh   # Cherry-pick commits from dev"
echo ""
echo "After cherry-picking and testing:"
echo "  .skills/hotfix/scripts/pr-hotfix.sh ${ENVIRONMENT} <app>   # app: client|server|mobile"
