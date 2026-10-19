#!/usr/bin/env bash
# Prints the release notes for <version>, in the format release-please used to write:
# `feat` and `fix` commits since the last `karfur-v*` tag, grouped by type.
# Usage: release-notes.sh <version>
set -euo pipefail

version=$1
repoUrl=https://github.com/refugies-info/karfur
lastTag=$(git tag -l 'karfur-v*' --sort=-v:refname | head -1)

echo "## [$version]($repoUrl/compare/$lastTag...karfur-v$version) ($(date +%F))"

for section in 'feat:Features' 'fix:Bug Fixes'; do
  type=${section%%:*}
  entries=$(git log --no-merges --format="%s ([%h]($repoUrl/commit/%H))" "$lastTag..HEAD" |
    grep -E "^$type(\(.+\))?!?: " |
    sed -E -e "s/^$type\(([^)]+)\)!?: /* **\1:** /" -e "s/^$type!?: /* /" || true)
  [[ -n "$entries" ]] && printf '\n\n### %s\n\n%s\n' "${section#*:}" "$entries"
done
