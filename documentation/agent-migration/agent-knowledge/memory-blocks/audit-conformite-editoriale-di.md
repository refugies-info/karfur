---
source: "Letta Cloud Agathe"
source_block_label: "system/compétence_conformité_éditoriale_di"
source_block_id: "block-0"
exported_at: "2026-06-09T14:13:15.424460+00:00"
qmd_indexable: true
---

# Audit de conformité éditoriale DI

## Rôle dans la migration

Arbre de décision de conformité éditoriale pour les fiches Data Inclusion.

## Source Letta Cloud

- Bloc mémoire : `system/compétence_conformité_éditoriale_di`
- Identifiant export : `block-0`
- Extraction : `GET /v1/agents/{agent_id}/export`

## Revue de migration

Ce fichier conserve les règles métier stables du bloc mémoire Agathe et les rend versionnables pour le futur corpus `qmd`.
Les références à l'ancien environnement Letta Cloud doivent être interprétées comme des exigences fonctionnelles à convertir en configuration, workflow ou outil déterministe dans les PR suivantes.

## Données personnelles et sensibles

- Aucune donnée personnelle directe détectée dans ce bloc.

## Contenu migré

## 📋 COMPÉTENCE: CONFORMITÉ ÉDITORIALE (Data Inclusion)

**Source:** Fichier JSON Data Inclusion (champ `extra`)
**Référence:** `ressources_conformité_éditoriale/jurisprudence.md`

⚠️ **NE PAS utiliser** `[PROCESS] Cas éditoriaux et jurisprudence.pdf` pour cette compétence.

### LOGIQUE DE DÉCISION (Arbre séquentiel)

**Règle d'or:** Toutes les étapes doivent être `✅ Accepté` pour une décision finale `Accepté`.
Dès qu'une étape est `❌ Refusé`, ARRÊT immédiat → Décision finale `Refusé`.

**Données manquantes:** Si un champ est vide ou absent → ❌ Refusé pour cette étape.

---

### ÉTAPE 1: CONVENTIONNEMENT
**Question:** Le dispositif est-il conventionné ?
**Champ JSON:** `extra.conventionnement`

| Clé | Valeur | Décision |
|-----|--------|----------|
| `0` | Non | ❌ Refusé |
| `1` | Oui | ✅ Accepté |

---

### ÉTAPE 2: FINANCEUR
**Question:** Le financeur est-il dans le périmètre RI ?
**Champ JSON:** `extra.code-financeur`

**Acceptés:** `2` (Conseil régional), `3` (FSE), `8` (Conseil général), `9` (Commune), `11` (Min. Emploi), `12` (Min. Éducation), `13` (État Autre), `15` (CT Autre), `19` (Min. Intérieur)

**Refusés:** `0`, `1`, `4`, `5`, `6`, `7`, `10`, `14`, `16`, `17`, `18`, `20`

---

### ÉTAPE 3: PUBLIC VISÉ
**Question:** Le public correspond-il au périmètre RI ?
**Champ JSON:** `extra.code-public-vise` (peut être un array)

**Codes acceptés:** `81021` (analphabète), `81043` (illectronisme), `81019` (illettrisme), `81022` (immigré), `81042` (réfugié), `82060` (travailleur étranger), `81023` (primo-arrivant)

**Logique en 2 temps :**
1. **Si** `code-public-vise` contient AU MOINS UN code accepté → ✅ Accepté
2. **Sinon**, analyse sémantique contextuelle sur l'ensemble du JSON (description, nom, conditions_acces, etc.) :
   - Indices à interpréter (liste non exhaustive) : "primo-arrivant", "CIR", "Contrat d'Intégration Républicaine", "réfugié", "BPI", "protection subsidiaire", "allophone", "OFII", "parcours d'intégration", "signataire du CIR"
   - ⚠️ **Analyser le SENS, pas juste la présence** : "pas pour les réfugiés" = refus, "destiné aux primo-arrivants" = accepté
   - **Si** le contexte indique que le public RI est bien ciblé → ✅ Accepté
   - **Sinon** → ❌ Refusé

**Documentation :** Quand le rattrapage sémantique est utilisé, expliquer le raisonnement dans le rapport pour l'équipe édito.

---

### ÉTAPE 4: TYPE DE DISPOSITIF
**Question:** Le type de dispositif rentre-t-il dans le périmètre RI ?
**Analyse:** Sémantique sur l'ensemble du JSON + consultation `jurisprudence.md`

| Type | Décision |
|------|----------|
| Droit commun utile aux réfugiés | ✅ Accepté |
| Sur orientation (accès clair) | ✅ Accepté |
| Appels à bénévolat (si valeur ajoutée) | ✅ Accepté |
| **OEPRE** (Ouvrir l'école aux parents...) | ❌ Refusé |
| **Dispositif réservé à une seule nationalité** | ❌ Refusé (voir règle ci-dessous) |
| Tous les autres types (lucratif, éphémère, plaidoyer, etc.) | ❌ Refusé |

**Règle nationalité (exclusion) :**
- Si le dispositif **exclut** d'autres nationalités (ex: "Ukrainiens uniquement", "réservé aux Afghans") → ❌ Refusé
- Si le dispositif est **inclusif** (ouvert à tous les réfugiés, même avec mention d'une nationalité) → ✅ Accepté
- **Champs à analyser :** `publics_precisions`, `info-public-vise`, `description`, `conditions_acces`

| Formulation | Interprétation | Décision |
|-------------|----------------|----------|
| "Réservé aux Ukrainiens" | Exclusif | ❌ Refusé |
| "Ukrainiens uniquement" | Exclusif | ❌ Refusé |
| "Public réfugié ET public ukrainien" | Inclusif (tous réfugiés + Ukrainiens) | ✅ Accepté |
| "Ouvert à tous, priorité Afghans" | Inclusif avec priorité | ✅ Accepté |

**Règle:** Seuls les types explicitement "Accepté" dans `jurisprudence.md` passent. Tous les "Cas par cas" → Refusé.

---

### ÉTAPE 5: DURÉE
**Champ JSON:** `extra.session.periode.debut` et `extra.session.periode.fin`
**Format date:** `YYYYMMDD` (ex: `20241218`)

#### Étape 5.1: Dispositif terminé ?
**Question:** Le dispositif est-il déjà terminé ?
**Comparaison:** `extra.session.periode.fin` vs date du jour de l'audit
- Si `fin` < date du jour → ❌ Refusé (dispositif expiré)
- Si `fin` ≥ date du jour → ✅ Poursuivre à l'Étape 5.2

#### Étape 5.2: Durée ≥ 20 jours ?
**Question:** La durée est-elle ≥ 20 jours ?

**Calcul:** `(fin - debut)` en jours
- Si ≥ 20 jours → ✅ Accepté
- Si < 20 jours → ❌ Refusé

---

### ÉTAPE 6: VOLUME ≥ 20 HEURES
**Question:** Le volume horaire est-il ≥ 20 heures ?
**Champs JSON (par priorité):**
1. `nombre-heures-total` (numérique, prioritaire)
2. `duree-indicative` (texte libre 0-150 car., ex: `"100 heures en centre"`)

**Extraction:** Utiliser `nombre-heures-total` si disponible, sinon parser `duree-indicative`
- Si ≥ 20 heures → ✅ Accepté
- Si < 20 heures → ❌ Refusé
- Si non parsable et les deux vides → ⚠️ Warning (review manuelle)

---

### FORMAT DE SORTIE

```
**Décision finale:** Fiche acceptée ✅ / Fiche refusée ❌

| Étape | Donnée trouvée | Décision |
|-------|----------------|----------|
| 1. Conventionnement | `1` | ✅ Accepté |
| 2. Financeur | `11` (Min. Emploi) | ✅ Accepté |
| 3. Public visé | `81042` (réfugié) | ✅ Accepté |
| 4. Type dispositif | Droit commun | ✅ Accepté |
| 5. Durée | 1082 jours | ✅ Accepté |
| 6. Volume horaire | 100h | ✅ Accepté |
```
