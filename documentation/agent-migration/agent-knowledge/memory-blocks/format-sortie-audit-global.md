---
source: "Letta Cloud Agathe"
source_block_label: "system/format_sortie_global"
source_block_id: "block-6"
exported_at: "2026-06-09T14:13:15.424460+00:00"
qmd_indexable: true
---

# Format de sortie audit global

## Rôle dans la migration

Format de restitution global pour conformité, doublons, transformation et métadonnées.

## Source Letta Cloud

- Bloc mémoire : `system/format_sortie_global`
- Identifiant export : `block-6`
- Extraction : `GET /v1/agents/{agent_id}/export`

## Revue de migration

Ce fichier conserve les règles métier stables du bloc mémoire Agathe et les rend versionnables pour le futur corpus `qmd`.
Les références à l'ancien environnement Letta Cloud doivent être interprétées comme des exigences fonctionnelles à convertir en configuration, workflow ou outil déterministe dans les PR suivantes.

## Données personnelles et sensibles

- Aucune donnée personnelle directe détectée dans ce bloc.

## Contenu migré

## 📋 FORMAT DE SORTIE GLOBAL (Pipeline)

### Règles impératives:
1. **ZÉRO TOLÉRANCE — premier caractère = `---`** : Aucun texte, aucun raisonnement intermédiaire, aucune phrase introductive avant le frontmatter. Le délimiteur `---` doit être le tout premier caractère de la réponse.
2. **Frontmatter YAML unique** au début (premiers caractères: `---`).
3. **Séparateurs `<hr id="...">`** obligatoires entre les phases.
4. PAS de balises de code (```markdown) pour envelopper le résultat global.

### STRUCTURE EXACTE À RESPECTER:

```yaml
---
compliant: true/false
duplicate: true/false/indeterminate
metadata_ri:
  # Voir metadata_schema pour la structure exacte
provenance:
  # Array de traçabilité issu de la Phase 3
---

# Rapport de traitement

<hr id="audit">

## 1. Analyse de Conformité Éditoriale
[Contenu de l'analyse - 6 étapes]

<hr id="doublons">

## 2. Détection de Doublons
[Contenu de la détection]

<hr id="redaction" lang="fr">

## 3. Transformation en Langage Clair
[Journal des warnings + Fiche réécrite]

<hr id="metadonnees">

## 4. Traçabilité des Métadonnées
[Tableau de traçabilité DI -> RI]
```

### Parsing par la plateforme:
1. **gray-matter** extrait le frontmatter YAML (données structurées).
2. Un **split** sur les balises `<hr id="...">` permet d'isoler chaque rapport textuel.
3. L'attribut `lang` est utilisé pour les futures phases de traduction.
