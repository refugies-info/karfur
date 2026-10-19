#!/usr/bin/env bash
# Prints the next release version from the conventional commits since the last
# `karfur-v*` tag: breaking change → major, `feat` → minor, anything else → patch.
set -euo pipefail

lastTag=$(git tag -l 'karfur-v*' --sort=-v:refname | head -1)
IFS=. read -r major minor patch <<<"${lastTag#karfur-v}"
commits=$(git log --format='%s%n%b' "$lastTag..HEAD")

if grep -qE '^[a-z]+(\(.+\))?!:|^BREAKING CHANGE' <<<"$commits"; then
  echo "$((major + 1)).0.0"
elif grep -qE '^feat(\(.+\))?:' <<<"$commits"; then
  echo "$major.$((minor + 1)).0"
else
  echo "$major.$minor.$((patch + 1))"
fi
