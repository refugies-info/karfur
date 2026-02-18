#!/usr/bin/env bash
#
# pr-hotfix.sh - Create a PR for a hotfix targeting the correct base branch
#
# Usage: pr-hotfix.sh <environment> <app>
#   environment: staging | production
#   app: client | server | mobile
#
# Example:
#   pr-hotfix.sh staging client
#   pr-hotfix.sh production server

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

# Determine base branch
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
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${CYAN}Creating PR for hotfix...${NC}"
echo "  Source branch: ${CURRENT_BRANCH}"
echo "  Target branch: ${BASE_BRANCH}"
echo "  Environment:   ${ENVIRONMENT}"
echo "  App:           ${APP}"
echo ""

# Ensure we have gh CLI
if ! command -v gh &>/dev/null; then
  echo -e "${RED}Error: GitHub CLI (gh) is required but not installed${NC}"
  echo "Install with: brew install gh"
  exit 1
fi

# Ensure authenticated
if ! gh auth status &>/dev/null; then
  echo -e "${RED}Error: Not authenticated with GitHub CLI${NC}"
  echo "Run: gh auth login"
  exit 1
fi

# Push the branch if not already pushed
echo "Pushing branch to origin..."
git push -u origin "$CURRENT_BRANCH"

# Get commits for PR body
echo ""
echo -e "${GREEN}Commits in this hotfix:${NC}"
COMMITS=$(git log --oneline "${BASE_BRANCH}..${CURRENT_BRANCH}" 2>/dev/null || git log --oneline "origin/${BASE_BRANCH}..${CURRENT_BRANCH}")
echo "$COMMITS" | sed 's/^/  /'

# Generate PR title
# Extract description from branch name: hotfix/staging/description -> description
DESCRIPTION=$(echo "$CURRENT_BRANCH" | sed 's|hotfix/[^/]*/||')
PR_TITLE="[hotfix][${APP}] ${DESCRIPTION}"

echo ""
echo -e "${CYAN}PR Title: ${PR_TITLE}${NC}"
echo -e "${CYAN}Base: ${BASE_BRANCH}${NC}"
echo ""

# Create PR body
PR_BODY=$(cat <<EOF
## Hotfix

**Environment:** ${ENVIRONMENT}
**App:** ${APP}

## Cherry-picked commits

${COMMITS}

## Test plan

- [ ] Tested locally
- [ ] Verified fix resolves the issue
- [ ] No regressions introduced

---
🔥 Hotfix created with \`.skills/hotfix\`
EOF
)

echo -e "${CYAN}Create PR? (Y/n)${NC}"
read -r CONFIRM

if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then
  echo "Aborting."
  exit 0
fi

# Create the PR
echo ""
echo -e "${GREEN}Creating PR...${NC}"

PR_URL=$(gh pr create \
  --base "$BASE_BRANCH" \
  --title "$PR_TITLE" \
  --body "$PR_BODY")

echo ""
echo -e "${GREEN}PR created successfully!${NC}"
echo -e "  ${CYAN}${PR_URL}${NC}"
