# Réfugiés.info agent-knowledge

This repository stores the Agathe migration knowledge corpus in:

```text
documentation/agent-migration/agent-knowledge
```

Use the project scripts instead of mutating qmd state manually when preparing or testing this corpus:

```bash
pnpm agent-knowledge:qmd:index
pnpm agent-knowledge:qmd:smoke
pnpm agent-knowledge:test
```

Default project qmd identifiers:

| Context | Index | Collection |
| ------- | ----- | ---------- |
| Developer search | `refugies-info-agent-knowledge` | `agent-knowledge` |
| Contract test | `refugies-info-agent-knowledge-test` | `agent-knowledge-test` |

For local searches against the migration corpus, start with lexical qmd search before model-backed commands:

```bash
qmd --index refugies-info-agent-knowledge search "modalitesEntreesSorties" --collection agent-knowledge -n 10
qmd --index refugies-info-agent-knowledge get "qmd://agent-knowledge/memory-blocks/schema-metadata-ri.md"
```

Future skill conversion PRs should continue to reference corpus files by repository target path, for example `memory-blocks/schema-metadata-ri.md`, not by Letta Cloud source path.
