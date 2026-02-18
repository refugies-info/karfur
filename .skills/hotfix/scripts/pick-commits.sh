#!/usr/bin/env bash
#
# pick-commits.sh - Interactive cherry-pick from dev branch
#
# Usage: pick-commits.sh [number_of_commits]
#   number_of_commits: How many recent commits to show (default: 20)
#
# Example:
#   pick-commits.sh        # Show last 20 commits
#   pick-commits.sh 50     # Show last 50 commits

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

usage() {
  echo "Usage: $0 [number_of_commits]"
  echo ""
  echo "Arguments:"
  echo "  number_of_commits   How many recent commits to show (default: 20)"
  echo ""
  echo "Examples:"
  echo "  $0           # Show last 20 commits"
  echo "  $0 50        # Show last 50 commits"
  exit 0
}

# Handle --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
fi

NUM_COMMITS="${1:-20}"

# Validate NUM_COMMITS is a number
if ! [[ "$NUM_COMMITS" =~ ^[0-9]+$ ]]; then
  echo -e "${RED}Error: number_of_commits must be a positive integer${NC}"
  usage
fi

# Ensure we're in a git repository
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo -e "${RED}Error: Not in a git repository${NC}"
  exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${CYAN}Current branch: ${CURRENT_BRANCH}${NC}"
echo ""

# Fetch latest dev
echo "Fetching latest from origin/dev..."
git fetch origin dev

# Check if we have fzf for a better interactive experience
USE_FZF=false
if command -v fzf &>/dev/null; then
  USE_FZF=true
fi

if $USE_FZF; then
  echo -e "${GREEN}Using fzf for interactive selection (Tab to select multiple, Enter to confirm)${NC}"
  echo ""
  
  # Use fzf for multi-select
  SELECTED=$(git log origin/dev -n "$NUM_COMMITS" --format="%h  %s" | \
    fzf --multi --reverse --header="Select commits to cherry-pick (Tab=select, Enter=confirm)" \
        --preview="git show --stat --color=always {1}" \
        --preview-window=right:50%:wrap || true)
  
  if [[ -z "$SELECTED" ]]; then
    echo -e "${YELLOW}No commits selected. Aborting.${NC}"
    exit 0
  fi
  
  # Extract SHAs (first field)
  SHAS=$(echo "$SELECTED" | awk '{print $1}')
else
  # Fallback: numbered list selection
  echo -e "${GREEN}Recent commits on origin/dev:${NC}"
  echo ""
  
  # Store commits in array
  mapfile -t COMMITS < <(git log origin/dev -n "$NUM_COMMITS" --format="%h  %s")
  
  # Display numbered list
  for i in "${!COMMITS[@]}"; do
    printf "  %2d) %s\n" "$((i + 1))" "${COMMITS[$i]}"
  done
  
  echo ""
  echo -e "${CYAN}Select commits to cherry-pick (comma-separated numbers, e.g., 1,3,5):${NC}"
  read -r SELECTION
  
  if [[ -z "$SELECTION" ]]; then
    echo -e "${YELLOW}No commits selected. Aborting.${NC}"
    exit 0
  fi
  
  # Parse selection and get SHAs
  SHAS=""
  IFS=',' read -ra INDICES <<< "$SELECTION"
  for idx in "${INDICES[@]}"; do
    # Trim whitespace
    idx=$(echo "$idx" | xargs)
    # Validate
    if [[ ! "$idx" =~ ^[0-9]+$ ]]; then
      echo -e "${RED}Invalid selection: $idx${NC}"
      exit 1
    fi
    if [[ "$idx" -lt 1 || "$idx" -gt "${#COMMITS[@]}" ]]; then
      echo -e "${RED}Selection out of range: $idx${NC}"
      exit 1
    fi
    # Get SHA (first word of commit line)
    SHA=$(echo "${COMMITS[$((idx - 1))]}" | awk '{print $1}')
    SHAS="$SHAS $SHA"
  done
fi

# Trim and convert to array
read -ra SHA_ARRAY <<< "$SHAS"

if [[ ${#SHA_ARRAY[@]} -eq 0 ]]; then
  echo -e "${YELLOW}No commits selected. Aborting.${NC}"
  exit 0
fi

echo ""
echo -e "${GREEN}Selected ${#SHA_ARRAY[@]} commit(s) to cherry-pick:${NC}"
for sha in "${SHA_ARRAY[@]}"; do
  git log --oneline -1 "$sha" | sed 's/^/  /'
done

echo ""
echo -e "${CYAN}Proceed with cherry-pick? (Y/n)${NC}"
read -r CONFIRM

if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then
  echo "Aborting."
  exit 0
fi

# Cherry-pick commits (in reverse order so oldest is applied first)
echo ""
echo -e "${GREEN}Cherry-picking commits...${NC}"

# Reverse the array for chronological order
REVERSED_SHAS=()
for ((i=${#SHA_ARRAY[@]}-1; i>=0; i--)); do
  REVERSED_SHAS+=("${SHA_ARRAY[$i]}")
done

for sha in "${REVERSED_SHAS[@]}"; do
  echo -e "  Cherry-picking ${CYAN}${sha}${NC}..."
  if ! git cherry-pick "$sha"; then
    echo ""
    echo -e "${RED}Cherry-pick failed for ${sha}${NC}"
    echo "Resolve conflicts, then run: git cherry-pick --continue"
    echo "Or abort with: git cherry-pick --abort"
    exit 1
  fi
done

echo ""
echo -e "${GREEN}Successfully cherry-picked ${#SHA_ARRAY[@]} commit(s)!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  1. Test your changes locally"
echo "  2. Create PR: .skills/hotfix/scripts/pr-hotfix.sh <environment> <app>"
