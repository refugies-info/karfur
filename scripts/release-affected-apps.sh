#!/usr/bin/env bash
# Lists which deployable apps are affected by the diff between two git refs.
# Usage: release-affected-apps.sh <base-ref> <head-ref>
# Prints `backend=`, `frontend=`, `mobile=` lines (true/false), GITHUB_OUTPUT compatible.
#
# Path lists mirror each app's `workspace:*` dependencies: keep them in sync
# when an app starts depending on another package.
set -euo pipefail

base=$1
head=$2

shared='^(package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|turbo\.json|\.npmrc|patches/|packages/typescript-config/)'
backendPaths="$shared|^(apps/server|packages/api-types|packages/mongo)/"
frontendPaths="$shared|^(apps/client|packages/api-types|packages/markdown-utils|packages/mongo|packages/sentry|packages/ui)/"
mobilePaths="$shared|^(apps/mobile|packages/api-types|packages/markdown-utils)/"

changedFiles=$(git diff --name-only "$base" "$head")

isAffected() {
  if grep -qE "$1" <<<"$changedFiles"; then echo true; else echo false; fi
}

echo "backend=$(isAffected "$backendPaths")"
echo "frontend=$(isAffected "$frontendPaths")"
echo "mobile=$(isAffected "$mobilePaths")"
