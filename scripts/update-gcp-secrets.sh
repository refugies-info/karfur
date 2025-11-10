#!/bin/bash

# Update Google Cloud Secret Manager with new unified service account credentials
# This script updates the GCLOUD_* secrets for the refugies-info project
# Run this after deploying the code changes that use environment variables

set -e

PROJECT_ID="refugies-info"
CREDENTIALS_FILE="./credentials/backend-google-apis.json"

echo "🔐 Updating Google Cloud Secret Manager for project: $PROJECT_ID"
echo ""

# Check if credentials file exists
if [ ! -f "$CREDENTIALS_FILE" ]; then
  echo "❌ Error: Credentials file not found at $CREDENTIALS_FILE"
  echo "Please ensure the backend-google-apis.json file exists in the credentials directory"
  exit 1
fi

# Extract values from credentials file
PROJECT_ID_VAL=$(jq -r '.project_id' "$CREDENTIALS_FILE")
PRIVATE_KEY_ID=$(jq -r '.private_key_id' "$CREDENTIALS_FILE")
CLIENT_EMAIL=$(jq -r '.client_email' "$CREDENTIALS_FILE")
CLIENT_ID=$(jq -r '.client_id' "$CREDENTIALS_FILE")
PRIVATE_KEY=$(jq -r '.private_key' "$CREDENTIALS_FILE")

echo "📝 Extracted credentials:"
echo "   Project ID: $PROJECT_ID_VAL"
echo "   Service Account: $CLIENT_EMAIL"
echo ""

# Function to create or update a secret
update_secret() {
  local secret_name=$1
  local secret_value=$2
  
  echo "📤 Updating secret: $secret_name"
  
  # Try to add a new version (assumes secret already exists)
  if gcloud secrets versions add "$secret_name" \
    --data-file=- \
    --project="$PROJECT_ID" \
    <<< "$secret_value" 2>/dev/null; then
    echo "   ✅ Secret version added"
  else
    # If secret doesn't exist, create it
    echo "   Creating new secret..."
    gcloud secrets create "$secret_name" \
      --data-file=- \
      --replication-policy="automatic" \
      --project="$PROJECT_ID" \
      <<< "$secret_value"
    echo "   ✅ Secret created"
  fi
}

# Update all secrets
echo "🔄 Updating secrets..."
echo ""

update_secret "GCLOUD_PROJECT_ID" "$PROJECT_ID_VAL"
update_secret "GCLOUD_PRIVATE_KEY_ID" "$PRIVATE_KEY_ID"
update_secret "GCLOUD_CLIENT_EMAIL" "$CLIENT_EMAIL"
update_secret "GCLOUD_CLIENT_ID" "$CLIENT_ID"
update_secret "GCLOUD_PKEY" "$PRIVATE_KEY"

echo ""
echo "✅ All secrets updated successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Deploy the updated code to staging/production"
echo "   2. The new credentials will be automatically loaded from Secret Manager"
echo "   3. Translation and Indexing APIs will use the new unified service account"
echo ""
echo "🔒 The credentials file (./credentials/backend-google-apis.json) is gitignored"
echo "   and should NOT be committed to the repository."
