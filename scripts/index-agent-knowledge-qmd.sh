#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CORPUS_DIR="${AGENT_KNOWLEDGE_CORPUS_DIR:-$ROOT_DIR/documentation/agent-migration/agent-knowledge}"
QMD_BIN="${QMD_BIN:-qmd}"
QMD_INDEX="${QMD_INDEX:-refugies-info-agent-knowledge}"
QMD_COLLECTION="${QMD_COLLECTION:-agent-knowledge}"

if ! command -v "$QMD_BIN" >/dev/null 2>&1; then
  cat >&2 <<EOF
qmd est introuvable.

Installez-le localement, par exemple :
  npm install -g @tobilu/qmd

Ou relancez avec QMD_BIN si le binaire porte un autre nom :
  QMD_BIN=/chemin/vers/qmd pnpm agent-knowledge:qmd:index
EOF
  exit 1
fi

if [[ ! -d "$CORPUS_DIR" ]]; then
  echo "Corpus introuvable : $CORPUS_DIR" >&2
  exit 1
fi

echo "Index qmd            : $QMD_INDEX"
echo "Collection qmd       : $QMD_COLLECTION"
echo "Corpus agent-knowledge: $CORPUS_DIR"

if "$QMD_BIN" --index "$QMD_INDEX" collection show "$QMD_COLLECTION" >/dev/null 2>&1; then
  echo "Collection existante : suppression avant réindexation du worktree courant."
  "$QMD_BIN" --index "$QMD_INDEX" collection remove "$QMD_COLLECTION"
fi

echo "Création de la collection."
"$QMD_BIN" --index "$QMD_INDEX" collection add "$CORPUS_DIR" --name "$QMD_COLLECTION"

echo "Indexation qmd terminée."
