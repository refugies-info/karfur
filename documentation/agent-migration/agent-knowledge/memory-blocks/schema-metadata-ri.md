---
source: "Letta Cloud Agathe"
source_block_label: "system/metadata_schema"
source_block_id: "block-11"
exported_at: "2026-06-09T14:13:15.424460+00:00"
qmd_indexable: true
---

# Schéma `metadata_ri`

## Rôle dans la migration

Contrat structuré attendu pour les métadonnées Réfugiés.info.

## Source Letta Cloud

- Bloc mémoire : `system/metadata_schema`
- Identifiant export : `block-11`
- Extraction : `GET /v1/agents/{agent_id}/export`

## Revue de migration

Ce fichier conserve les règles métier stables du bloc mémoire Agathe et les rend versionnables pour le futur corpus `qmd`.
Les références à l'ancien environnement Letta Cloud doivent être interprétées comme des exigences fonctionnelles à convertir en configuration, workflow ou outil déterministe dans les PR suivantes.

## Données personnelles et sensibles

- Aucune donnée personnelle directe détectée dans ce bloc.

## Contenu migré

## Schéma de sortie : metadata_ri

Ta sortie DOIT inclure un bloc YAML frontmatter avec la clé `metadata_ri`.
L'objet `metadata_ri` doit respecter ce schéma exactement.
Après avoir rédigé ta sortie, appelle `validate_metadata_ri` pour la vérifier et corriger les erreurs.

### Type TypeScript

```typescript
type Poi = {
  title?: string; address?: string; city?: string;
  lat?: number; lng?: number;
  email?: string; phone?: string; description?: string;
};

type MetadataRi = {
  // Identité
  titreMarque?: string | null;
  mainSponsor?: string | null;
  logo?: string | null;
  abstract?: string | null;

  // Thèmes & Besoins (tableaux d'identifiants, ou null)
  theme?: string | null;
  secondaryThemes?: string[] | null;
  needs?: string[] | null;

  // Public
  publicStatus?: string[] | null;
  public?: string[] | null;
  frenchLevel?: string[] | null;
  age?: {
    type?: "lessThan" | "moreThan" | "between";
    ages?: number[];
  } | null;

  // Modalités
  price?: {
    values: number[];   // DOIT être des nombres, pas des chaînes
    details?: string;   // omettre si vide
  } | null;
  commitment?: {
    amountDetails?: "minimum" | "maximum" | "approximately" | "exactly" | "between";
    hours?: number[];
    timeUnit?: string;
  } | null;
  frequency?: {
    amountDetails?: "minimum" | "maximum" | "approximately" | "exactly";
    hours?: number;     // nombre unique, PAS un tableau
    timeUnit?: string;
    frequencyUnit?: string;
  } | null;
  sessions?: {
    modalitesEntreesSorties: 0 | 1 | null;  // 0=dates fixes, 1=entrées permanentes, null=inconnu
    items: Array<{ startDate?: string; endDate?: string }> | null;
  } | null;
  timeSlots?: string[] | null;

  // Géographie
  location?: "france" | "online" | string[] | null;
  conditions?: string[] | null;
  map?: Poi | Poi[] | null;
};
```

### Enums stricts (corrections production 2026-05-18)

**`commitment.timeUnit` et `frequency.timeUnit`** → toujours `"hours"` (jamais `"total"`, `"hour"`, `"heures"`, etc.)
**`frenchLevel`** → uniquement les valeurs CECRL valides : `"alpha"`, `"A1"`, `"A2"`, `"B1"`, `"B2"`, `"C1"`, `"C2"` — `"A1.1"` n'existe pas, mapper vers `"A1"`.

### Règles importantes (erreurs les plus fréquentes)

**⚠️ RAPPEL CRITIQUE : commitment ≠ frequency**
- `commitment.amountDetails`: "minimum" | "maximum" | "approximately" | "exactly" | **"between"**
- `frequency.amountDetails`:  "minimum" | "maximum" | "approximately" | "exactly" **(PAS de "between")**
- `commitment.hours`: `number[]` (tableau, ex: `[100]` ou `[50, 150]` si between)
- `frequency.hours`: `number` (scalaire unique, ex: `4`)

**Règle 1 — Ne jamais encapsuler des objets dans des tableaux.**
Les champs `price`, `age`, `commitment`, `frequency` sont des objets, PAS des tableaux.
❌ `price: [{ values: [0] }]`
✅ `price: { values: [0] }`

**Règle 2 — price.values doit contenir des nombres, pas des chaînes.**
❌ `price: { values: ["50"] }`
❌ `price: { values: ["gratuit"] }`   # gratuit = values: [0]
✅ `price: { values: [50] }`
✅ `price: { values: [0] }`           # gratuit

**Règle 3 — price.details doit être omis (pas une chaîne vide) s'il est absent.**
❌ `price: { values: [0], details: "" }`
✅ `price: { values: [0] }`

**Règle 4 — frequency.hours est un nombre unique, pas un tableau.**
❌ `frequency: { hours: [4], frequencyUnit: "week" }`
✅ `frequency: { hours: 4, frequencyUnit: "week" }`

**Règle 5 — Utiliser null, et non [], pour les tableaux optionnels absents.**
❌ `secondaryThemes: []`
✅ `secondaryThemes: null`

**Règle 6 — sessions est un OBJET avec modalitesEntreesSorties + items, PAS un tableau simple.**
❌ `sessions: [{ startDate: "2025-01-01" }]`
✅ `sessions: { modalitesEntreesSorties: null, items: [{ startDate: "2025-01-01" }] }`

**Règle 7 — amountDetails doit être une valeur exacte de l'énumération.**
commitment.amountDetails: "minimum" | "maximum" | "approximately" | "exactly" | "between"
frequency.amountDetails:  "minimum" | "maximum" | "approximately" | "exactly"

### Exemple de frontmatter YAML correct

```yaml
---
metadata_ri:
  titreMarque: "Formation FLE A1-A2"
  mainSponsor: null
  abstract: "Formation de français langue étrangère pour débutants."
  theme: "FR"
  secondaryThemes: null
  needs: ["LEARN_FRENCH"]
  publicStatus: ["asile", "refugie"]
  public: null
  frenchLevel: ["A1", "A2"]
  age: null
  price:
    values: [0]
  commitment:
    amountDetails: "exactly"
    hours: [20]
    timeUnit: "hours"
  frequency:
    hours: 4
    frequencyUnit: "week"
  sessions:
    modalitesEntreesSorties: 0
    items:
      - startDate: "2025-09-01"
        endDate: "2025-12-20"
  timeSlots: ["morning"]
  location: ["75 - Paris", "92 - Hauts-de-Seine"]
  conditions: null
  map: null
---
```
