#!/bin/bash

# Rollback Google Cloud Secret Manager to old traduction project credentials
# This script restores the previous GCLOUD_* secrets if the hotfix needs to be reverted

set -e

PROJECT_ID="refugies-info"

echo "⚠️  ROLLBACK: Restoring old traduction project credentials"
echo "Project: $PROJECT_ID"
echo ""
echo "This will restore the following secrets to their previous values:"
echo "  - GCLOUD_PROJECT_ID"
echo "  - GCLOUD_PRIVATE_KEY_ID"
echo "  - GCLOUD_CLIENT_EMAIL"
echo "  - GCLOUD_CLIENT_ID"
echo "  - GCLOUD_PKEY"
echo ""

# Confirm before proceeding
read -p "Are you sure you want to rollback? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
  echo "Rollback cancelled."
  exit 0
fi

echo ""
echo "🔄 Rolling back secrets..."
echo ""

# Function to rollback a secret to previous version
rollback_secret() {
  local secret_name=$1
  
  echo "📥 Rolling back secret: $secret_name"
  
  # List versions and get the second most recent (previous version)
  local versions=$(gcloud secrets versions list "$secret_name" \
    --project="$PROJECT_ID" \
    --format="value(name)" \
    --limit=2)
  
  local previous_version=$(echo "$versions" | tail -1)
  
  if [ -z "$previous_version" ]; then
    echo "   ⚠️  No previous version found"
    return 1
  fi
  
  # Destroy the current version (the new one we just created)
  local current_version=$(echo "$versions" | head -1)
  
  echo "   Destroying current version: $current_version"
  gcloud secrets versions destroy "$current_version" \
    --secret="$secret_name" \
    --project="$PROJECT_ID" \
    --quiet
  
  echo "   ✅ Rolled back to version: $previous_version"
}

# Rollback all secrets
rollback_secret "GCLOUD_PROJECT_ID"
rollback_secret "GCLOUD_PRIVATE_KEY_ID"
rollback_secret "GCLOUD_CLIENT_EMAIL"
rollback_secret "GCLOUD_CLIENT_ID"
rollback_secret "GCLOUD_PKEY"

echo ""
echo "✅ All secrets rolled back successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Revert the code changes (git revert or git checkout)"
echo "   2. Redeploy with the reverted code"
echo "   3. Translation API will use the old traduction project credentials"
echo ""
echo "⚠️  Note: Make sure to revert the code changes as well!"
echo "   The old credentials won't work with the new code that expects"
echo "   GCLOUD_PROJECT_ID to be set in the environment."
