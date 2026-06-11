# Skills agent Playground

Ce document mappe les slash commands du Playground Agathe vers les skills Letta Code versionnés dans le dépôt.

Ce dossier est enrichi PR par PR : la structure initiale des skills est en place, puis chaque commande historique est convertie plus finement dans son skill dédié. Le branchement runtime Letta Code, les workers et les changements de comportement applicatif restent hors périmètre tant qu'une PR ne les mentionne pas explicitement.

## Emplacement des skills

Les skills sont stockés dans le dossier racine [`skills/`](../../../skills), afin de suivre la convention standard Letta Code et de préparer leur chargement futur par le runtime.

## Mapping des commandes historiques

| Slash command historique | Skill Letta Code                                  | Rôle                                                                                                          |
| ------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `/audit`                 | [`audit`](../../../skills/audit/SKILL.md)         | Exécuter l'audit de conformité éditoriale et la détection de doublons.                                        |
| `/redaction`             | [`redaction`](../../../skills/redaction/SKILL.md) | Transformer une fiche Data Inclusion en Markdown Réfugiés.info en langage clair.                              |
| `/metadata`              | [`metadata`](../../../skills/metadata/SKILL.md)   | Produire le frontmatter `metadata_ri` et la provenance des métadonnées.                                       |
| `/pipeline`              | Composition `audit` + `redaction` + `metadata`    | Conserver le workflow historique Audit → Rédaction → Métadonnées. Aucun skill dédié n'est créé dans cette PR. |

## Mapping des commandes ajoutées par la migration

| Slash command cible | Skill Letta Code                                  | Rôle                                                                               |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/translate`        | [`translate`](../../../skills/translate/SKILL.md) | Traduire ou vérifier un contenu Réfugiés.info en préservant la structure Markdown. |

## Skill d'outillage qmd

| Skill Letta Code                          | Rôle                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [`qmd`](../../../skills/qmd/SKILL.md)     | Rechercher et récupérer des documents Markdown indexés localement avec le CLI ou MCP qmd.        |

Le skill `qmd` est installé depuis le paquet officiel `@tobilu/qmd` et reste un outil de recherche local. Il ne remplace pas les skills métier Agathe (`audit`, `redaction`, `metadata`, `translate`) : il les aide à consulter le corpus `agent-knowledge` sans dupliquer les règles longues.

La note projet [`skills/qmd/references/refugies-info-agent-knowledge.md`](../../../skills/qmd/references/refugies-info-agent-knowledge.md) documente les noms d'index/collection utilisés par ce dépôt.

## Relation avec le corpus `agent-knowledge`

Les skills ne dupliquent pas les règles métier longues. Ils pointent vers le corpus versionné et indexable par `qmd` :

- `documentation/agent-migration/agent-knowledge/memory-blocks/` pour les anciens blocs mémoire critiques ;
- `documentation/agent-migration/agent-knowledge/langage-clair/` pour les références éditoriales ;
- `documentation/agent-migration/agent-knowledge/metadatas/` pour les schémas et mappings ;
- `documentation/agent-migration/agent-knowledge/conformite-editoriale/` pour les référentiels de conformité.

Les skills référencent les chemins cible versionnés du corpus. Les chemins source Letta Cloud restent conservés dans la provenance (`source_path`, `original_file_name`, manifeste), même quand ils contiennent une coquille. Les corrections de chemins cible sont documentées dans la [convention de nommage du corpus](../agent-knowledge/README.md#convention-de-nommage).

## Contrat de test

Toute PR qui ajoute, renomme ou supprime une référence corpus dans un skill doit lancer :

```bash
pnpm agent-knowledge:test
```

Cette commande vérifie statiquement les références `skills/*/SKILL.md` vers le corpus, contrôle la cohérence du manifeste `_export-manifest.json`, puis reconstruit un index `qmd` de test isolé avant d'exécuter une recherche smoke.

Les futures PRs de conversion détaillée (`audit`, `redaction`, `metadata`, `translate`) doivent ajouter leurs cas de test sans redéfinir ce contrat : elles peuvent spécialiser la requête `qmd` avec `QMD_SMOKE_QUERY` et `QMD_SMOKE_EXPECTED_RESULT`, ou étendre le validateur quand un nouveau type de référence devient obligatoire.

## Notes de migration

- Les noms de skills restent volontairement proches des commandes Playground pour faciliter la transition.
- Les descriptions frontmatter indiquent les déclencheurs afin que l'agent sache quand charger chaque skill.
- Les comportements déterministes, validations runtime et appels outils seront ajoutés dans des PR ultérieures.
