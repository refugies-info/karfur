# Skills agent Playground

Ce document mappe les slash commands du Playground Agathe vers les skills Letta Code versionnés dans le dépôt.

Cette PR crée uniquement la structure des skills. Elle ne branche pas encore ces skills dans un runtime Letta Code, ne modifie aucun worker et ne change aucun comportement applicatif.

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

## Relation avec le corpus `agent-knowledge`

Les skills ne dupliquent pas les règles métier longues. Ils pointent vers le corpus versionné et indexable par `qmd` :

- `documentation/agent-migration/agent-knowledge/memory-blocks/` pour les anciens blocs mémoire critiques ;
- `documentation/agent-migration/agent-knowledge/langage-clair/` pour les références éditoriales ;
- `documentation/agent-migration/agent-knowledge/metadatas/` pour les schémas et mappings ;
- `documentation/agent-migration/agent-knowledge/conformite-editoriale/` pour les référentiels de conformité.

Les skills référencent les chemins cible versionnés du corpus. Les chemins source Letta Cloud restent conservés dans la provenance (`source_path`, `original_file_name`, manifeste), même quand ils contiennent une coquille. Les corrections de chemins cible sont documentées dans la [convention de nommage du corpus](../agent-knowledge/README.md#convention-de-nommage).

## Notes de migration

- Les noms de skills restent volontairement proches des commandes Playground pour faciliter la transition.
- Les descriptions frontmatter indiquent les déclencheurs afin que l'agent sache quand charger chaque skill.
- Les comportements déterministes, validations runtime et appels outils seront ajoutés dans des PR ultérieures.
