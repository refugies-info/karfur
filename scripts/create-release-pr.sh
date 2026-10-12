#!/usr/bin/env bash
# Opens a release PR.
# Usage: create-release-pr.sh <base> <head> <title> [--speed]
# --speed tags the title with `[speed]`: once merged, the release pipeline only
# redeploys the apps touched by the diff (see scripts/release-affected-apps.sh).
set -euo pipefail

base=$1
head=$2
title=$3
body=''

if [[ "${4:-}" == "--speed" ]]; then
  git fetch --quiet origin "$base" "$head"
  affectedApps=$("$(dirname "$0")/release-affected-apps.sh" "origin/$base" "origin/$head")
  title="$title [speed]"
  # Preview only: CI recomputes the diff at merge time.
  body=$(printf 'Speed release: only affected apps are redeployed.\n\n```\n%s\n```' "$affectedApps")
  echo "$affectedApps"
fi

gh pr create -B "$base" -H "$head" -l release -t "$title" -b "$body"
