# Blocs de mémoire vive

Ce dossier regroupe les blocs de mémoire vive critiques d'Agathe après extraction, nettoyage et première revue de migration.

L'objectif est de remplacer une mémoire Letta Cloud opaque par des connaissances versionnées et relisibles par l'équipe.

## Source

Les fichiers de ce dossier proviennent de l'export Letta Cloud de l'agent Agathe :

```text
GET /v1/agents/{agent_id}/export
```

Chaque fichier indique le bloc mémoire source dans son frontmatter et dans la section `Source Letta Cloud`.

## Contenus extraits

| Fichier | Bloc Letta Cloud | Usage |
| --- | --- | --- |
| [`routeur-competences.md`](./routeur-competences.md) | `system/compétence_routeur` | Routage des commandes `/audit`, `/redaction`, `/metadata` et `/pipeline`. |
| [`audit-conformite-editoriale-di.md`](./audit-conformite-editoriale-di.md) | `system/compétence_conformité_éditoriale_di` | Arbre de décision de conformité éditoriale pour les fiches Data Inclusion. |
| [`detection-doublons.md`](./detection-doublons.md) | `system/compétence_détection_doublons` | Règles de recherche et de qualification des doublons RI. |
| [`mapping-metadonnees-di.md`](./mapping-metadonnees-di.md) | `system/compétence_métadonnées_di` | Mapping Data Inclusion vers `metadata_ri`. |
| [`schema-metadata-ri.md`](./schema-metadata-ri.md) | `system/metadata_schema` | Contrat de sortie `metadata_ri`. |
| [`format-sortie-audit-global.md`](./format-sortie-audit-global.md) | `system/format_sortie_global` | Format global d'audit et de pipeline. |
| [`format-sortie-metadonnees.md`](./format-sortie-metadonnees.md) | `system/format_sortie_metadonnées` | Format de restitution de la phase métadonnées. |
| [`format-sortie-transformation.md`](./format-sortie-transformation.md) | `system/format_sortie_transformation` | Format de restitution de la transformation rédactionnelle. |
| [`transformation-langage-clair.md`](./transformation-langage-clair.md) | `system/compétence_transformation_langage_clair` | Cadre de transformation en langage clair. |
| [`regles-redaction-langage-clair.md`](./regles-redaction-langage-clair.md) | `system/règles_rédaction_langage_clair` | Règles éditoriales pour publics allophones A1/A2. |
| [`lexique-vif.md`](./lexique-vif.md) | `system/mémoire_vive_lexique` | Lexique administratif simplifié fréquemment utilisé. |

## Notes de migration

Ces fichiers ne sont pas destinés à rester des prompts conversationnels inchangés. Ils servent de base versionnée pour :

- distinguer les connaissances métier stables des instructions propres à l'ancien environnement Letta Cloud ;
- préparer les règles et formats testables du futur worker ;
- rendre chaque bloc indexable indépendamment par `qmd`.

Les données personnelles ou sensibles repérées pendant l'extraction sont exclues ou remplacées par des placeholders explicites dans le fichier concerné.
