---
name: qmd
description: Bootstrap QMD search instructions from the installed qmd CLI. Use when users ask to find notes, retrieve documents, inspect a wiki, or answer from indexed local markdown.
license: MIT
compatibility: Requires qmd CLI. Run `qmd skill show` for version-matched instructions.
allowed-tools: Bash(qmd:*) mcp__qmd__*
---

# QMD - Query Markdown Documents

This installed skill is intentionally a small bootstrap so it does not go stale
when the qmd package updates.

Load the full, version-matched QMD instructions from the CLI:

!`qmd skill show`

If your agent does not support bang-command expansion, run:

```bash
qmd skill show
```

Then follow those instructions. In short: search first, fetch full sources with
`qmd get` or `qmd multi-get`, and answer from retrieved text rather than snippets.

For this repository's `agent-knowledge` corpus defaults, see
`references/refugies-info-agent-knowledge.md`.
