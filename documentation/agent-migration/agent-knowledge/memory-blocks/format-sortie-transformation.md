---
source: "Letta Cloud Agathe"
source_block_label: "system/format_sortie_transformation"
source_block_id: "block-8"
exported_at: "2026-06-09T14:13:15.424460+00:00"
qmd_indexable: true
---

# Format de sortie transformation

## Rôle dans la migration

Format Markdown attendu pour la transformation en langage clair.

## Source Letta Cloud

- Bloc mémoire : `system/format_sortie_transformation`
- Identifiant export : `block-8`
- Extraction : `GET /v1/agents/{agent_id}/export`

## Revue de migration

Ce fichier conserve les règles métier stables du bloc mémoire Agathe et les rend versionnables pour le futur corpus `qmd`.
Les références à l'ancien environnement Letta Cloud doivent être interprétées comme des exigences fonctionnelles à convertir en configuration, workflow ou outil déterministe dans les PR suivantes.

## Données personnelles et sensibles

- Aucune donnée personnelle directe détectée dans ce bloc.

## Contenu migré

## 📋 FORMAT DE SORTIE: TRANSFORMATION EN LANGAGE CLAIR

### Règles impératives:
1. PAS de texte introductif avant le frontmatter.
2. **Frontmatter YAML vide** en début (`--- \n ---`), sera enrichi par la Phase 3.
3. **PAS de balises de code** (```markdown) pour envelopper le résultat.
4. Journal des warnings en `###` **à la fin** de la fiche, juste avant le Lexique.
5. Contenu fiche démarrant par le Titre Informatif en niveau `#`.
6. Utilisation systématique des **directives remark** (`:::`) pour les blocs structurants.
7. Pas d'emoji dans la sortie finale.
8. **JAMAIS créer de titres non définis** — Les seuls titres autorisés sont ceux listés dans la structure ci-dessous. Aucune initiative de création (ex: "C'est quoi ?", "C'est qui ?", "À savoir", etc.).
9. **Titres d'accordéons : jamais "Étape"** — Le contenu peut décrire des étapes séquentielles, mais le titre de l'accordéon ne doit JAMAIS contenir "Étape 1", "Étape 2", etc. Utiliser directement l'action (ex: "Contacter l'organisme", "Préparer les documents").
9b. **Titres d'accordéons : jamais de verbes creux liés à la formation elle-même** — Éviter les titres du type "Démarrer la formation", "Commencer la formation", "Suivre la formation", "Intégrer la formation". Ces actions ne sont pas opérationnellement actionnables (la fiche entière porte déjà sur le fait de rejoindre la formation). Préférer des titres qui décrivent une démarche concrète et préalable (ex: "Contacter l'organisme", "Envoyer votre candidature", "Préparer votre dossier").
10. **Pas de phrase en italique après le titre** — Aucune ligne en italique type "*(résumé de l'action)*" après le titre H1. La description commence directement en texte normal.
11. **Pas de listes à puces pour les exemples dans les accordéons** — Les exemples doivent être intégrés au texte, jamais sous forme de liste à puces.
12. **Ne pas mentionner la gratuité** — Ne jamais écrire "Cette formation est gratuite" ou équivalent. Tous les dispositifs publiés sont gratuits, et cette info est déjà dans les métadonnées.
13. **Ne pas forcer le contenu** — Si le JSON source est pauvre, ne pas inventer d'exemples ou d'arguments pour remplir les accordéons. Pour "Pourquoi c'est intéressant ?", générer au minimum 3 accordéons justifiés par la matière disponible. Pour "Comment faire ?", générer exactement 1 accordéon. Signaler dans le Journal des Avertissements si le contenu source est insuffisant pour respecter ces contraintes.
14. **Ne jamais extrapoler** — Rester strictement fidèle au texte source. Ne jamais ajouter de mécanisme, procédure ou détail non explicitement mentionné. Exemple interdit : source dit "Niveau A2 attendu" → écrire "un test vérifie votre niveau A2" (le test n'est pas mentionné = invention).
15. **Ne pas mentionner les dates d'inscription** — Ne jamais écrire "Les inscriptions sont ouvertes du X au Y". Seules les dates de session (`session.periode.debut` / `session.periode.fin`) peuvent être mentionnées, pas les dates d'inscription (`periode-inscription`).
16. **Ne pas mentionner la localisation** — Ne jamais écrire "vérifier que vous habitez dans la bonne zone" ou mentionner le département/la région. Cette info est déjà dans les métadonnées (`location`).
17. **Ne pas mentionner le financeur** — Ne jamais écrire "financé par l'État", "dispositif BOP 104", "subventionné par la région", etc. Cette info n'est pas pertinente pour l'utilisateur.

### STRUCTURE EXACTE À RESPECTER:

```
---
---

# Titre Informatif

[Description 2-3 phrases: nature + objectif + caractéristiques — PAS DE TITRE "C'est quoi ?"]

:::good-to-know
[Conseil si applicable]
:::

## Pourquoi c'est intéressant ?

:::toggle{title="[Titre court]"}
[Description avec exemple concret]
:::

:::toggle{title="[Titre court]"}
[Description avec exemple concret]
:::

:::toggle{title="[Titre court]"}
[Description avec exemple concret]
:::

## Comment faire ?

:::toggle{title="[Titre court]"}
[Description de l'étape]
:::

### Autres informations

[Liste séparée par virgules: niveau français requis, thématiques, conditions d'accès, public prioritaire]

### Pour aller plus loin

- Source 1: [Titre – Organisme – URL]
- Source 2: [Titre – Organisme – URL]

### Journal des Avertissements

| Type de problème | Champ ou élément | Niveau de risque | Détail / justification | Suggestion de correction |
|------------------|------------------|------------------|------------------------|--------------------------|
| [Type] | [Champ] | majeur/moyen/mineur/faible | [Description] | [Action proposée] |

### Lexique

**[Terme technique]** : [Explication simple 1-2 phrases]
**[Autre terme]** : [Explication simple]
```

### Utilisation des composants
- **:::toggle** : Pour les sections "Pourquoi c'est intéressant ?" et "Comment faire ?".
- **:::important** : Pour les informations cruciales ou bloquantes. Peut être mis dans un toggle.
- **:::good-to-know** : Pour les conseils et infos contextuelles. Peut être mis dans un toggle.
