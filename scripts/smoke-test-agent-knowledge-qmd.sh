#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QMD_BIN="${QMD_BIN:-qmd}"
QMD_INDEX="${QMD_INDEX:-refugies-info-agent-knowledge}"
QMD_COLLECTION="${QMD_COLLECTION:-agent-knowledge}"
SMOKE_QUERY="${QMD_SMOKE_QUERY:-modalitesEntreesSorties}"
EXPECTED_RESULT="${QMD_SMOKE_EXPECTED_RESULT:-memory-blocks/schema-metadata-ri.md}"
EXPECTED_URI="qmd://$QMD_COLLECTION/$EXPECTED_RESULT"

"$ROOT_DIR/scripts/index-agent-knowledge-qmd.sh"

echo "Recherche smoke test : $SMOKE_QUERY"
SEARCH_OUTPUT="$(
  "$QMD_BIN" --index "$QMD_INDEX" search "$SMOKE_QUERY" \
    --collection "$QMD_COLLECTION" \
    -n 10
)"

printf '%s\n' "$SEARCH_OUTPUT"

if ! grep -Fq "$EXPECTED_URI" <<<"$SEARCH_OUTPUT"; then
  cat >&2 <<EOF
Smoke test qmd échoué.

Résultat attendu : $EXPECTED_URI
Requête          : $SMOKE_QUERY
Index            : $QMD_INDEX
Collection       : $QMD_COLLECTION
EOF
  exit 1
fi

echo "Smoke test qmd réussi."
