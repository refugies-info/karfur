# Corpus documentaire agent-knowledge

## Objectif

Ce dossier contient le corpus documentaire versionné qui servira de source à l'indexation `qmd` pour le nouvel agent IA Réfugiés.info.

Il doit permettre de transformer les connaissances aujourd'hui présentes dans Letta Cloud en ressources lisibles, relues et maintenables dans le dépôt.

## Relation avec l'inventaire Letta Cloud

La structure initiale du corpus reprend les groupes identifiés dans l'[inventaire Letta Cloud de l'agent Agathe](../letta-cloud-inventory.md).

Les prochaines PR ajouteront progressivement les contenus exportés, normalisés et validés. Cette PR crée uniquement l'arborescence cible et les notes d'usage.

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

## Règles de contribution

- Ne pas commiter de secrets, tokens, clés API ou valeurs d'environnement sensibles.
- Conserver la traçabilité avec les chemins exportés depuis Letta Cloud quand un contenu provient de l'ancien agent.
- Privilégier les formats textuels versionnables (`.md`, `.json`, `.csv`) quand c'est possible.
- Documenter toute normalisation de nom, de format ou de contenu.
- Séparer les connaissances métier stables des instructions techniques propres à Letta Cloud.
