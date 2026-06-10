# Skills agent Playground

Ce dossier prépare la structure des skills Letta Code qui remplaceront les slash commands historiques du Playground Agathe.

Cette PR crée uniquement les fichiers `SKILL.md` versionnés. Elle ne branche pas encore ces skills dans un runtime Letta Code, ne modifie aucun worker et ne change aucun comportement applicatif.

## Mapping des commandes historiques

| Slash command historique | Skill Letta Code | Rôle |
| --- | --- | --- |
| `/audit` | [`audit`](./audit/SKILL.md) | Exécuter l'audit de conformité éditoriale et la détection de doublons. |
| `/redaction` | [`redaction`](./redaction/SKILL.md) | Transformer une fiche Data Inclusion en Markdown Réfugiés.info en langage clair. |
| `/metadata` | [`metadata`](./metadata/SKILL.md) | Produire le frontmatter `metadata_ri` et la provenance des métadonnées. |
| `/translate` | [`translate`](./translate/SKILL.md) | Traduire ou vérifier un contenu Réfugiés.info en préservant la structure Markdown. |

## Relation avec le corpus `agent-knowledge`

Les skills ne dupliquent pas les règles métier longues. Ils pointent vers le corpus versionné et indexable par `qmd` :

- `documentation/agent-migration/agent-knowledge/memory-blocks/` pour les anciens blocs mémoire critiques ;
- `documentation/agent-migration/agent-knowledge/langage-clair/` pour les références éditoriales ;
- `documentation/agent-migration/agent-knowledge/metadatas/` pour les schémas et mappings ;
- `documentation/agent-migration/agent-knowledge/conformite-editoriale/` pour les référentiels de conformité.

## Notes de migration

- Les noms de skills restent volontairement proches des commandes historiques pour faciliter la transition du Playground.
- Les descriptions frontmatter indiquent les déclencheurs afin que l'agent sache quand charger chaque skill.
- Les comportements déterministes, validations runtime et appels outils seront ajoutés dans des PR ultérieures.
