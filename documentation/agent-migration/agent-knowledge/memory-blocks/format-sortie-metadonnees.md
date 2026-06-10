---
source: "Letta Cloud Agathe"
source_block_label: "system/format_sortie_metadonnées"
source_block_id: "block-7"
exported_at: "2026-06-09T14:13:15.424460+00:00"
qmd_indexable: true
---

# Format de sortie métadonnées

## Rôle dans la migration

Format Markdown/frontmatter attendu pour la phase métadonnées.

## Source Letta Cloud

- Bloc mémoire : `system/format_sortie_metadonnées`
- Identifiant export : `block-7`
- Extraction : `GET /v1/agents/{agent_id}/export`

## Revue de migration

Ce fichier conserve les règles métier stables du bloc mémoire Agathe et les rend versionnables pour le futur corpus `qmd`.
Les références à l'ancien environnement Letta Cloud doivent être interprétées comme des exigences fonctionnelles à convertir en configuration, workflow ou outil déterministe dans les PR suivantes.

## Données personnelles et sensibles

- Aucune donnée personnelle directe détectée dans ce bloc.

## Contenu migré

## 📋 FORMAT DE SORTIE: MAPPING MÉTADONNÉES DI/RCO → RI

### Règles impératives
1. **ZÉRO TOLÉRANCE — premier caractère = `---`** : Aucun texte, aucun raisonnement intermédiaire avant le frontmatter. Le délimiteur `---` doit être le tout premier caractère de la réponse.
2. **Frontmatter YAML** avec deux clés : `metadata_ri` + `provenance`
3. **Schéma `metadata_ri`** : voir bloc `metadata_schema` (source de vérité)
4. **Validation** : appeler `validate_metadata_ri` avant toute sortie
5. **Tableau Markdown** lisible dans le corps du rapport

### Structure du rapport

```
---
metadata_ri:
  # Voir metadata_schema pour la structure exacte
provenance:
  - key: "..."
    label: "..."
    value: "..."
    status: "valid|partial|missing|warning"
    source:
      - field: "champ1"
        rawValue: "valeur brute 1"
      - field: "champ2"
        rawValue: "valeur brute 2"
---

## Métadonnées mappées

| Métadonnée | Valeur(s) renseignée(s) | Source |
|---|---|---|
| Titre marque | [valeur lisible] | champ(s) source |
| Structure | ... | ... |
| ... | ... | ... |

## ⚠️ Métadonnées incomplètes (si applicable)

| Métadonnée | Problème | Suggestion |
|---|---|---|
| [Métadonnée] | [Description] | [Action proposée] |
```

### Schéma `provenance`

| Champ | Type | Description |
|-------|------|-------------|
| `key` | string | Clé technique (ex: `frenchLevel`) |
| `label` | string | Label UI (ex: "Niveau de français") |
| `value` | string | Valeur lisible pour affichage |
| `status` | enum | `valid` (donnée extraite correctement) / `partial` (donnée incomplète) / `missing` (champ absent) / `warning` (donnée présente mais ambiguë ou nécessitant review) — **NE PAS utiliser `warning` si la donnée est techniquement valide** : les alertes contextuelles (ex: zone géographique large) vont dans le texte Markdown, pas dans ce champ. |
| `source` | array | Champ(s) source (toujours un array d'objets `{ field, rawValue }`) — **TOUJOURS inclure à la fois le nom du champ ET sa valeur brute**, sans exception (chiffre, code, date, texte, etc.) |

### Ordre des métadonnées (tableau)

1. Titre marque
2. Structure
3. Logo
4. En bref
5. Thèmes
6. Besoins
7. Public visé
8. Public
9. Fréquence
10. Niveau de français
11. Âge
12. Prix
13. Durée totale
14. Session
15. Jours de présence
16. Départements
17. Conditions
18. Zone d'action

### Formatage du tableau

- **Valeurs simples** : affichage direct
- **Arrays** : séparées par virgule
- **Objets** : notation condensée (ex: "4h/semaine", "Gratuit")
- **Dates** : format humain (JJ/MM/YYYY)
- **Données manquantes** : cellule vide (pas de "N/A")
