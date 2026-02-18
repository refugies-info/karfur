#!/usr/bin/env bash
#
# pick-commits.sh - Interactive cherry-pick from dev branch
#
# Usage: pick-commits.sh [--pr | --commits] [count]
#   --pr        Select a merged PR to cherry-pick (default)
#   --commits   Select individual commits
#   count       Number of items to show (default: 20)
#
# Example:
#   pick-commits.sh              # Show last 20 merged PRs
#   pick-commits.sh --pr 30      # Show last 30 merged PRs
#   pick-commits.sh --commits    # Show last 20 commits
#   pick-commits.sh --commits 50 # Show last 50 commits

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

usage() {
  echo "Usage: $0 [--pr | --commits] [count]"
  echo ""
  echo "Options:"
  echo "  --pr        Select a merged PR to cherry-pick (default)"
  echo "  --commits   Select individual commits"
  echo "  count       Number of items to show (default: 20)"
  echo ""
  echo "Examples:"
  echo "  $0                 # Show last 20 merged PRs"
  echo "  $0 --pr 30         # Show last 30 merged PRs"
  echo "  $0 --commits       # Show last 20 commits"
  echo "  $0 --commits 50    # Show last 50 commits"
  exit 0
}

# Handle --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
fi

# Parse arguments
MODE="pr"  # Default to PR mode
COUNT=20

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pr)
      MODE="pr"
      shift
      ;;
    --commits)
      MODE="commits"
      shift
      ;;
    *)
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        COUNT="$1"
      else
        echo -e "${RED}Error: Unknown argument: $1${NC}"
        usage
      fi
      shift
      ;;
  esac
done

# Ensure we're in a git repository
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo -e "${RED}Error: Not in a git repository${NC}"
  exit 1
fi

# Ensure gh CLI is available for PR mode
if [[ "$MODE" == "pr" ]] && ! command -v gh &>/dev/null; then
  echo -e "${YELLOW}Warning: GitHub CLI (gh) not found, falling back to commit mode${NC}"
  MODE="commits"
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

#
# PR MODE
#
if [[ "$MODE" == "pr" ]]; then
  echo -e "${GREEN}Fetching recent merged PRs to dev...${NC}"
  echo ""
  
  # Get merged PRs
  PR_LIST=$(gh pr list --state merged --base dev --limit "$COUNT" --json number,title,mergeCommit,author --jq '.[] | "\(.number)\t\(.title)\t\(.mergeCommit.oid // "unknown")\t\(.author.login)"' 2>/dev/null || echo "")
  
  if [[ -z "$PR_LIST" ]]; then
    echo -e "${YELLOW}No merged PRs found or gh CLI error. Falling back to commit mode.${NC}"
    MODE="commits"
  else
    if $USE_FZF; then
      echo -e "${GREEN}Using fzf for PR selection (Enter to confirm)${NC}"
      echo ""
      
      # Format for fzf display
      SELECTED=$(echo "$PR_LIST" | while IFS=$'\t' read -r num title sha author; do
        echo "#${num}  ${title} (@${author})"
      done | fzf --reverse --header="Select a PR to cherry-pick" \
                 --preview="gh pr view {1} --json commits,files --jq '.commits[].oid' | head -10; echo '---'; gh pr view {1} --json files --jq '.files[].path' | head -10" \
                 --preview-window=right:40%:wrap || true)
      
      if [[ -z "$SELECTED" ]]; then
        echo -e "${YELLOW}No PR selected. Aborting.${NC}"
        exit 0
      fi
      
      # Extract PR number
      PR_NUM=$(echo "$SELECTED" | grep -oE '^#[0-9]+' | tr -d '#')
    else
      # Numbered list fallback
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
      echo -e "${CYAN}Select a PR number (1-${#PRS[@]}):${NC}"
      read -r SELECTION
      
      if [[ -z "$SELECTION" ]] || ! [[ "$SELECTION" =~ ^[0-9]+$ ]]; then
        echo -e "${YELLOW}Invalid selection. Aborting.${NC}"
        exit 0
      fi
      
      if [[ "$SELECTION" -lt 1 || "$SELECTION" -gt "${#PRS[@]}" ]]; then
        echo -e "${RED}Selection out of range.${NC}"
        exit 1
      fi
      
      # Get PR number from selection
      IFS=$'\t' read -r PR_NUM _ _ _ <<< "${PRS[$((SELECTION - 1))]}"
    fi
    
    echo ""
    echo -e "${GREEN}Fetching commits for PR #${PR_NUM}...${NC}"
    
    # Get commits for the PR
    PR_COMMITS=$(gh pr view "$PR_NUM" --json commits --jq '.commits[].oid' 2>/dev/null || echo "")
    
    if [[ -z "$PR_COMMITS" ]]; then
      echo -e "${RED}Error: Could not fetch commits for PR #${PR_NUM}${NC}"
      exit 1
    fi
    
    # Convert to array
    mapfile -t SHA_ARRAY <<< "$PR_COMMITS"
    
    echo ""
    echo -e "${GREEN}PR #${PR_NUM} has ${#SHA_ARRAY[@]} commit(s):${NC}"
    for sha in "${SHA_ARRAY[@]}"; do
      git log --oneline -1 "$sha" 2>/dev/null | sed 's/^/  /' || echo "  $sha (not found locally)"
    done
    
    echo ""
    echo -e "${CYAN}Cherry-pick all ${#SHA_ARRAY[@]} commit(s)? (Y/n)${NC}"
    read -r CONFIRM
    
    if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then
      echo "Aborting."
      exit 0
    fi
    
    # Cherry-pick commits (already in chronological order from API)
    echo ""
    echo -e "${GREEN}Cherry-picking commits...${NC}"
    
    for sha in "${SHA_ARRAY[@]}"; do
      echo -e "  Cherry-picking ${CYAN}${sha:0:7}${NC}..."
      if ! git cherry-pick "$sha"; then
        echo ""
        echo -e "${RED}Cherry-pick failed for ${sha}${NC}"
        echo "Resolve conflicts, then run: git cherry-pick --continue"
        echo "Or abort with: git cherry-pick --abort"
        exit 1
      fi
    done
    
    echo ""
    echo -e "${GREEN}Successfully cherry-picked PR #${PR_NUM} (${#SHA_ARRAY[@]} commit(s))!${NC}"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "  1. Test your changes locally"
    echo "  2. Create PR: .skills/hotfix/scripts/pr-hotfix.sh <environment> <app>"
    exit 0
  fi
fi

#
# COMMITS MODE
#
echo -e "${GREEN}Showing recent commits on origin/dev...${NC}"
echo ""

if $USE_FZF; then
  echo -e "${GREEN}Using fzf for interactive selection (Tab to select multiple, Enter to confirm)${NC}"
  echo ""
  
  # Use fzf for multi-select
  SELECTED=$(git log origin/dev -n "$COUNT" --format="%h  %s" | \
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
  mapfile -t COMMITS < <(git log origin/dev -n "$COUNT" --format="%h  %s")
  
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
