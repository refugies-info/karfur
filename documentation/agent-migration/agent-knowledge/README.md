# Corpus documentaire agent-knowledge

## Objectif

Ce dossier contient le corpus documentaire versionné qui servira de source à l'indexation `qmd` pour le nouvel agent IA Réfugiés.info.

Il doit permettre de transformer les connaissances aujourd'hui présentes dans Letta Cloud en ressources lisibles, relues et maintenables dans le dépôt.

## Relation avec l'inventaire Letta Cloud

La structure initiale du corpus reprend les groupes identifiés dans l'[inventaire Letta Cloud de l'agent Agathe](../letta-cloud-inventory.md).

Les contenus exportés depuis Letta Cloud sont ajoutés progressivement via le script d'export décrit ci-dessous. Les ressources générées restent traçables par rapport aux chemins logiques Letta Cloud d'origine.

## Structure

> Le dossier `metadatas/` conserve le nom utilisé dans les ressources exportées depuis Letta Cloud, malgré l’anglicisme, afin de préserver la traçabilité avec la source.

| Dossier | Usage |
| --- | --- |
| `langage-clair/` | Références de langage clair, chartes, lexiques et guides de transformation rédactionnelle. |
| `exemples-redaction/` | Exemples de fiches initiales et finales utilisés pour guider les transformations. |
| `metadatas/` | Mapping, schémas et références de métadonnées Réfugiés.info. |
| `conformite-editoriale/` | Règles, jurisprudence et référentiels de conformité éditoriale. |
| `memory-blocks/` | Blocs de mémoire vive critiques d'Agathe, après extraction et revue. |
| `archival/` | Mémoire archivée utile après tri : décisions, jurisprudence et historique produit. |

## Indexation qmd

Les documents de ce dossier ont vocation à être indexés par `qmd` afin d'être utilisés par l'agent Letta Code SDK.

La configuration d'indexation et les scripts associés seront ajoutés dans des PR ultérieures. Les fichiers de ce corpus doivent donc rester structurés, traçables et faciles à convertir en entrée `qmd`.

## Export Letta Cloud

Le script `agent-knowledge:export` récupère l'export complet de l'agent via l'endpoint fiable `GET /v1/agents/{agent_id}/export`, équivalent SDK de `client.agents.exportFile(agentId)`. Il n'utilise pas les anciennes APIs Letta files/folders, désormais dépréciées.

```bash
PLAYGROUND_LETTA_API_KEY=... PLAYGROUND_AGENT_ID=... pnpm agent-knowledge:export
```

Variables attendues :

- `PLAYGROUND_LETTA_API_KEY` : clé API Playground utilisée uniquement pour l'export.
- `PLAYGROUND_AGENT_ID` : identifiant de l'agent Agathe à exporter.
- `PLAYGROUND_LETTA_BASE_URL` : optionnel, vaut `https://api.letta.com` par défaut.

Ces variables peuvent être passées à la commande ou renseignées dans le `.env` local non versionné.

Le script refuse volontairement de lire `LETTA_API_KEY` ou `LETTA_PROJECT_ID`, afin d'éviter toute confusion avec les environnements applicatifs.

Options utiles :

```bash
pnpm agent-knowledge:export --dry-run
pnpm agent-knowledge:export --from-file /tmp/agathe-export.json
pnpm agent-knowledge:export --output-dir /tmp/agent-knowledge
```

Normalisations appliquées :

- les chemins logiques Letta Cloud sont conservés dans les métadonnées `source_path` et dans le manifeste `_export-manifest.json` ;
- les préfixes Letta Cloud sont rangés dans les dossiers versionnés du corpus (`ressources_langage_clair/*` → `langage-clair/*`, etc.) ;
- la source `ressources_exemples_redaction` est exclue du corpus cible après revue qualité ;
- les PDF sont convertis en Markdown à partir du texte extrait par Letta Cloud ;
- les contenus Markdown restent en Markdown avec frontmatter de traçabilité ;
- les contenus JSON et CSV restent dans leur format textuel natif ;
- le script affiche les compteurs fichiers/chunks, les fichiers exclus et les alertes d'extraction faible, notamment les PDF indexés avec un seul chunk.

## Règles de contribution

- Ne pas commiter de secrets, tokens, clés API ou valeurs d'environnement sensibles.
- Conserver la traçabilité avec les chemins exportés depuis Letta Cloud quand un contenu provient de l'ancien agent.
- Privilégier les formats textuels versionnables (`.md`, `.json`, `.csv`) quand c'est possible.
- Documenter toute normalisation de nom, de format ou de contenu.
- Séparer les connaissances métier stables des instructions techniques propres à Letta Cloud.
