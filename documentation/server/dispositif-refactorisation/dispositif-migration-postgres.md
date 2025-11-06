# Migration MongoDB → PostgreSQL : Analyse et recommandations

## Résumé exécutif

**Verdict : ✅ Normalisation MongoDB d'abord, PostgreSQL ensuite (si nécessaire)**

La migration directe vers PostgreSQL serait **risquée et coûteuse** (6-9 mois, risque élevé). Une approche **progressive en 3 phases** est recommandée :

1. **Phase 1 (2-3 mois)** : Normalisation MongoDB → Résout 80% des problèmes, facilite future migration
2. **Phase 2 (1 mois)** : Évaluation des besoins réels
3. **Phase 3 (2 mois, optionnelle)** : Migration PostgreSQL **SI nécessaire** (probabilité 30-40%)

**Avantages de cette approche** :
- ✅ Risque divisé par 2 (migrations séquentielles vs big bang)
- ✅ Effort réduit de 20% si migration PostgreSQL nécessaire (17 vs 21 semaines)
- ✅ Possibilité de ne jamais migrer vers PostgreSQL (60-70% de probabilité)
- ✅ Normalisation MongoDB = assurance stratégique

**Score bénéfice/risque** :
- Migration directe PostgreSQL : **4/10** (risque trop élevé)
- Normalisation MongoDB puis PostgreSQL : **8.5/10** (stratégie gagnant-gagnant)

---

## Table des matières

1. [Pourquoi migrer vers PostgreSQL ?](#pourquoi-migrer-vers-postgresql)
2. [Comment migrer ?](#comment-migrer)
3. [Risques et défis](#risques-et-défis)
4. [Recommandation finale](#recommandation-finale)
5. [Alternative : Normalisation MongoDB](#alternative--normalisation-mongodb)

---

## Pourquoi migrer vers PostgreSQL ?

### Arguments POUR la migration

#### 1. **Relations et intégrité référentielle** ✅

**Problème actuel (MongoDB)** :
```typescript
// Pas de contraintes FK, risque d'orphelins
{
  _id: ObjectId("..."),
  mainSponsor: ObjectId("structure_supprimée"),  // ❌ Référence cassée
  theme: ObjectId("theme_inexistant"),           // ❌ Référence cassée
  needs: [ObjectId("need_supprimé")]             // ❌ Référence cassée
}
```

**Avec PostgreSQL** :
```sql
CREATE TABLE dispositifs (
  id UUID PRIMARY KEY,
  main_sponsor_id UUID REFERENCES structures(id) ON DELETE SET NULL,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE RESTRICT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ✅ Impossible de supprimer un theme utilisé
-- ✅ Suppression structure → main_sponsor_id = NULL automatique
```

**Bénéfice** : Intégrité garantie au niveau base de données.

---

#### 2. **Requêtes complexes et agrégations** ✅

**Problème actuel (MongoDB)** :
```typescript
// Agrégation complexe difficile à lire
const stats = await DispositifModel.aggregate([
  { $match: { status: "Actif" } },
  { $lookup: { from: "structures", localField: "mainSponsor", foreignField: "_id", as: "sponsor" } },
  { $unwind: "$sponsor" },
  { $group: { _id: "$sponsor.nom", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
]);
```

**Avec PostgreSQL** :
```sql
-- ✅ SQL standard, lisible, optimisé
SELECT s.nom, COUNT(*) as count
FROM dispositifs d
JOIN structures s ON d.main_sponsor_id = s.id
WHERE d.status = 'Actif'
GROUP BY s.nom
ORDER BY count DESC
LIMIT 10;
```

**Bénéfice** : Requêtes plus lisibles, query planner plus mature.

---

#### 3. **Transactions ACID robustes** ✅

**Problème actuel (MongoDB)** :
```typescript
// Transactions multi-documents limitées
const session = await mongoose.startSession();
session.startTransaction();
try {
  await DispositifModel.updateOne({...}, { session });
  await DispositifTranslationModel.create([{...}], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
```

**Avec PostgreSQL** :
```sql
-- ✅ Transactions natives, performantes
BEGIN;
  UPDATE dispositifs SET status = 'Actif' WHERE id = '...';
  INSERT INTO dispositif_translations (...) VALUES (...);
  INSERT INTO dispositif_events (...) VALUES (...);
COMMIT;
```

**Bénéfice** : Transactions plus simples et performantes.

---

#### 4. **Schéma structuré et validation** ✅

**Problème actuel (MongoDB)** :
```typescript
// Schéma flexible = risque d'incohérence
{
  status: "Actif",           // ✅ OK
  metadatas: {
    location: ["75", "92"],  // ✅ OK
    age: { min: 18 }         // ❌ Manque max, incohérent
  }
}

{
  status: "Actiff",          // ❌ Typo non détectée
  metadatas: "invalid"       // ❌ Type incorrect
}
```

**Avec PostgreSQL** :
```sql
CREATE TYPE dispositif_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'DELETED');

CREATE TABLE dispositifs (
  id UUID PRIMARY KEY,
  status dispositif_status NOT NULL DEFAULT 'DRAFT',
  age_min INTEGER CHECK (age_min >= 0 AND age_min <= 150),
  age_max INTEGER CHECK (age_max >= age_min),
  location TEXT[] NOT NULL DEFAULT '{}',
  CONSTRAINT valid_age CHECK (age_max IS NULL OR age_max >= age_min)
);

-- ✅ Impossible d'insérer des données invalides
```

**Bénéfice** : Validation au niveau base de données, cohérence garantie.

---

#### 5. **Full-text search natif** ✅

**Problème actuel (MongoDB)** :
```typescript
// Text search limité
db.dispositifs.createIndex({ "translations.fr.content.titreInformatif": "text" });
db.dispositifs.find({ $text: { $search: "logement" } });
// ❌ Pas de ranking sophistiqué
// ❌ Pas de recherche par pertinence
```

**Avec PostgreSQL** :
```sql
-- ✅ Full-text search puissant avec ts_vector
CREATE INDEX idx_dispositif_search ON dispositifs 
USING GIN (to_tsvector('french', titre_informatif || ' ' || abstract));

SELECT *, ts_rank(to_tsvector('french', titre_informatif), query) as rank
FROM dispositifs, to_tsquery('french', 'logement') query
WHERE to_tsvector('french', titre_informatif) @@ query
ORDER BY rank DESC;
```

**Bénéfice** : Recherche plus pertinente, ranking natif.

---

#### 6. **JSON + Relationnel (meilleur des deux mondes)** ✅

**Avec PostgreSQL** :
```sql
CREATE TABLE dispositifs (
  id UUID PRIMARY KEY,
  status dispositif_status NOT NULL,
  -- Données structurées
  theme_id UUID REFERENCES themes(id),
  
  -- Données flexibles en JSONB
  metadatas JSONB,
  
  -- Index sur JSONB
  CONSTRAINT valid_metadatas CHECK (jsonb_typeof(metadatas) = 'object')
);

CREATE INDEX idx_location ON dispositifs USING GIN ((metadatas->'location'));

-- Requête hybride
SELECT * FROM dispositifs 
WHERE theme_id = '...' 
  AND metadatas->'location' ? '75';
```

**Bénéfice** : Flexibilité JSON + rigueur relationnelle.

---

### Arguments CONTRE la migration

#### 1. **Perte de flexibilité schéma** ❌

**MongoDB** : Schéma flexible, évolution facile
**PostgreSQL** : Migrations ALTER TABLE nécessaires

#### 2. **Complexité des données multilingues** ❌

**MongoDB** :
```typescript
{
  translations: {
    fr: { content: {...} },
    en: { content: {...} },
    ar: { content: {...} }
  }
}
```

**PostgreSQL** : Nécessite normalisation complète
```sql
-- Table séparée obligatoire
CREATE TABLE dispositif_translations (
  dispositif_id UUID REFERENCES dispositifs(id),
  language VARCHAR(2),
  content JSONB,
  PRIMARY KEY (dispositif_id, language)
);
```

#### 3. **Perte de performance sur documents imbriqués** ❌

**MongoDB** : Lecture d'un document = 1 requête
**PostgreSQL** : Lecture avec relations = N requêtes ou JOINs

#### 4. **Courbe d'apprentissage équipe** ❌

Équipe habituée à MongoDB/Mongoose, migration = formation nécessaire.

---

## Comment migrer ?

### Phase 1 : Préparation (2-3 mois)

#### 1.1 Modélisation PostgreSQL

```sql
-- Schéma principal
CREATE TABLE dispositifs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_contenu VARCHAR(20) NOT NULL CHECK (type_contenu IN ('DISPOSITIF', 'DEMARCHE')),
  status dispositif_status NOT NULL DEFAULT 'DRAFT',
  
  -- Relations
  creator_id UUID NOT NULL REFERENCES users(id),
  main_sponsor_id UUID REFERENCES structures(id) ON DELETE SET NULL,
  theme_id UUID NOT NULL REFERENCES themes(id),
  
  -- Métadonnées
  nb_mots INTEGER DEFAULT 0,
  has_draft_version BOOLEAN DEFAULT FALSE,
  
  -- Dates
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  deletion_date TIMESTAMP,
  
  -- Contraintes
  CONSTRAINT valid_status_dates CHECK (
    (status = 'ACTIVE' AND published_at IS NOT NULL) OR
    (status != 'ACTIVE')
  )
);

-- Index
CREATE INDEX idx_dispositifs_status ON dispositifs(status);
CREATE INDEX idx_dispositifs_theme ON dispositifs(theme_id);
CREATE INDEX idx_dispositifs_creator ON dispositifs(creator_id);
CREATE INDEX idx_dispositifs_published ON dispositifs(published_at DESC) WHERE status = 'ACTIVE';

-- Traductions
CREATE TABLE dispositif_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispositif_id UUID NOT NULL REFERENCES dispositifs(id) ON DELETE CASCADE,
  language VARCHAR(2) NOT NULL,
  content JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'VALIDATED',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  validator_id UUID REFERENCES users(id),
  
  UNIQUE(dispositif_id, language)
);

CREATE INDEX idx_translations_dispositif ON dispositif_translations(dispositif_id);
CREATE INDEX idx_translations_language ON dispositif_translations(language);

-- Avis
CREATE TABLE dispositif_avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispositif_id UUID NOT NULL REFERENCES dispositifs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  anonymous_user_id VARCHAR(255),
  avis BOOLEAN NOT NULL,
  language VARCHAR(2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT user_or_anonymous CHECK (
    (user_id IS NOT NULL AND anonymous_user_id IS NULL) OR
    (user_id IS NULL AND anonymous_user_id IS NOT NULL)
  )
);

CREATE INDEX idx_avis_dispositif ON dispositif_avis(dispositif_id);
CREATE INDEX idx_avis_created ON dispositif_avis(created_at DESC);

-- Events (audit)
CREATE TABLE dispositif_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispositif_id UUID NOT NULL REFERENCES dispositifs(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  changes JSONB,
  
  CHECK (event_type IN ('created', 'updated', 'published', 'archived', 'deleted'))
);

CREATE INDEX idx_events_dispositif ON dispositif_events(dispositif_id, timestamp DESC);
CREATE INDEX idx_events_type ON dispositif_events(event_type);
```

#### 1.2 Migration des données

```typescript
// Script de migration
import { Pool } from 'pg';
import mongoose from 'mongoose';

const pgPool = new Pool({ connectionString: process.env.POSTGRES_URL });

async function migrateDispositifs() {
  const dispositifs = await DispositifModel.find({}).lean();
  
  for (const dispositif of dispositifs) {
    const client = await pgPool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Insérer dispositif principal
      const { rows: [newDispositif] } = await client.query(`
        INSERT INTO dispositifs (
          id, type_contenu, status, creator_id, main_sponsor_id, theme_id,
          nb_mots, has_draft_version, created_at, updated_at, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
        dispositif._id.toString(),
        dispositif.typeContenu,
        dispositif.status,
        dispositif.creatorId.toString(),
        dispositif.mainSponsor?.toString(),
        dispositif.theme.toString(),
        dispositif.nbMots,
        dispositif.hasDraftVersion,
        dispositif.created_at,
        dispositif.lastModificationDate,
        dispositif.publishedAt
      ]);
      
      // 2. Migrer traductions
      for (const [lang, translation] of Object.entries(dispositif.translations || {})) {
        await client.query(`
          INSERT INTO dispositif_translations (
            dispositif_id, language, content, created_at, validator_id
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          newDispositif.id,
          lang,
          JSON.stringify(translation.content),
          translation.created_at,
          translation.validatorId?.toString()
        ]);
      }
      
      // 3. Migrer avis
      for (const avis of dispositif.avis || []) {
        await client.query(`
          INSERT INTO dispositif_avis (
            dispositif_id, user_id, anonymous_user_id, avis, language, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          newDispositif.id,
          avis.userId?.toString(),
          avis.anonymousUserId,
          avis.avis,
          avis.language,
          avis.created_at
        ]);
      }
      
      await client.query('COMMIT');
      console.log(`✅ Migré dispositif ${dispositif._id}`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Erreur migration ${dispositif._id}:`, error);
    } finally {
      client.release();
    }
  }
}
```

---

### Phase 2 : Dual-write (1-2 mois)

```typescript
// Écrire dans MongoDB ET PostgreSQL
export const createDispositif = async (body: CreateDispositifRequest, userId: Id) => {
  // 1. Créer dans MongoDB (existant)
  const mongoDispositif = await DispositifModel.create({...});
  
  // 2. Créer dans PostgreSQL (nouveau)
  try {
    await pgPool.query(`
      INSERT INTO dispositifs (...) VALUES (...)
    `);
  } catch (error) {
    console.error('PostgreSQL write failed:', error);
    // Ne pas bloquer si PostgreSQL échoue
  }
  
  return mongoDispositif;
};
```

---

### Phase 3 : Bascule lecture (1 mois)

```typescript
// Lire depuis PostgreSQL, fallback MongoDB
export const getDispositifById = async (id: string) => {
  try {
    const { rows } = await pgPool.query(`
      SELECT d.*, 
             json_agg(dt.*) as translations
      FROM dispositifs d
      LEFT JOIN dispositif_translations dt ON dt.dispositif_id = d.id
      WHERE d.id = $1
      GROUP BY d.id
    `, [id]);
    
    return rows[0];
  } catch (error) {
    console.warn('PostgreSQL read failed, fallback to MongoDB');
    return await DispositifModel.findById(id);
  }
};
```

---

### Phase 4 : Nettoyage (1 mois)

- Arrêter dual-write
- Supprimer code MongoDB
- Optimiser requêtes PostgreSQL

---

## Risques et défis

### Risques CRITIQUES

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Perte de données** | Moyen | Critique | Backup complet + validation |
| **Downtime prolongé** | Élevé | Critique | Migration progressive + rollback |
| **Performance dégradée** | Élevé | Élevé | Tests de charge exhaustifs |
| **Bugs dans requêtes** | Élevé | Élevé | Tests unitaires + intégration |

### Défis techniques

#### 1. **Gestion des ObjectId MongoDB**

```typescript
// MongoDB
_id: ObjectId("507f1f77bcf86cd799439011")

// PostgreSQL
id: UUID "550e8400-e29b-41d4-a716-446655440000"

// ❌ Problème : Références cassées dans le code client
```

**Solution** : Garder ObjectId comme string dans PostgreSQL temporairement.

#### 2. **Données imbriquées complexes**

```typescript
// MongoDB : Document imbriqué naturel
{
  translations: {
    fr: { content: { titreInformatif, abstract, what, how, why } }
  }
}

// PostgreSQL : JSONB ou normalisation complète ?
```

**Dilemme** : JSONB = perte de typage, normalisation = complexité.

#### 3. **Migrations de schéma**

```sql
-- Chaque évolution nécessite migration
ALTER TABLE dispositifs ADD COLUMN new_field TEXT;
-- ❌ Peut être lent sur grosse table
-- ❌ Nécessite downtime ou stratégie complexe
```

#### 4. **ORM et TypeScript**

```typescript
// Mongoose : Typage automatique
const dispositif = await DispositifModel.findById(id);
dispositif.status // ✅ Type DispositifStatus

// PostgreSQL + Prisma/TypeORM : Configuration complexe
```

---

## Recommandation finale

### ❌ Migration NON recommandée

**Raisons** :

1. **Effort disproportionné** : 6-9 mois de migration vs bénéfices limités
2. **Risque élevé** : Perte de données, bugs, downtime
3. **MongoDB suffit** : Avec normalisation, MongoDB peut gérer les besoins actuels
4. **Coût opportunité** : Temps mieux investi dans features utilisateur

### ✅ Alternative recommandée : Normalisation MongoDB

**Plan d'action** :

1. **Court terme (1-2 mois)** :
   - Créer collections séparées (translations, avis, events)
   - Ajouter index optimisés
   - Implémenter event sourcing

2. **Moyen terme (3-6 mois)** :
   - Migrer données vers collections normalisées
   - Améliorer requêtes avec agrégations optimisées
   - Implémenter cache Redis

3. **Long terme (6-12 mois)** :
   - CQRS avec read models
   - Matérialized views pour performance
   - Réévaluer PostgreSQL si volume × 10

**Bénéfices** :

- ✅ Résout 80% des problèmes identifiés
- ✅ Risque faible (pas de changement de technologie)
- ✅ Migration progressive sans downtime
- ✅ Équipe reste productive

---

## Alternative : Normalisation MongoDB

### Schéma normalisé MongoDB

```typescript
// Collection principale (allégée)
collection: dispositifs {
  _id: ObjectId,
  typeContenu: "DISPOSITIF" | "DEMARCHE",
  status: DispositifStatus,
  creatorId: ObjectId,
  mainSponsor: ObjectId,
  theme: ObjectId,
  nbMots: number,
  hasDraftVersion: boolean,
  created_at: Date,
  updated_at: Date
}

// Collections séparées
collection: dispositif_translations {
  _id: ObjectId,
  dispositifId: ObjectId,  // Index
  language: string,
  content: DispositifContent,
  status: string,
  created_at: Date
}

collection: dispositif_avis {
  _id: ObjectId,
  dispositifId: ObjectId,  // Index
  userId?: ObjectId,
  avis: boolean,
  created_at: Date
}

collection: dispositif_events {
  _id: ObjectId,
  dispositifId: ObjectId,  // Index
  eventType: string,
  userId: ObjectId,
  timestamp: Date,
  changes: object[]
}
```

### Comparaison finale

| Critère | PostgreSQL | MongoDB normalisé |
|---------|------------|-------------------|
| **Intégrité référentielle** | ✅✅✅ Natif | ⚠️ Application level |
| **Requêtes complexes** | ✅✅✅ SQL | ✅✅ Agrégations |
| **Transactions** | ✅✅✅ ACID natif | ✅✅ Multi-doc OK |
| **Flexibilité schéma** | ❌ Migrations | ✅✅✅ Flexible |
| **Performance documents** | ⚠️ JOINs | ✅✅✅ Natif |
| **Courbe apprentissage** | ❌❌ Élevée | ✅✅✅ Connue |
| **Risque migration** | ❌❌❌ Élevé | ✅✅ Faible |
| **Effort** | ❌❌❌ 6-9 mois | ✅✅ 2-3 mois |

**Score final** :
- **PostgreSQL** : 6/10 (bénéfices réels mais effort/risque trop élevés)
- **MongoDB normalisé** : 8.5/10 (meilleur compromis)

---

## Conclusion

### Stratégie recommandée : Normalisation MongoDB d'abord, PostgreSQL ensuite (si nécessaire)

La migration directe vers PostgreSQL serait **risquée et coûteuse**. Une approche **progressive en 2 phases** est plus pragmatique :

#### Phase 1 : Normalisation MongoDB (2-3 mois) 🚀 **RECOMMANDÉ**

**Objectifs** :
- Créer collections séparées (translations, avis, merci, events)
- Migrer données existantes
- Adapter code pour requêtes normalisées
- Valider le modèle de données

**Bénéfices** :
- ✅ Résout 80% des problèmes identifiés
- ✅ Risque faible (pas de changement de technologie)
- ✅ Performance × 3-5
- ✅ Scalabilité × 5-10
- ✅ **Facilite énormément une future migration PostgreSQL**

#### Phase 2 : Évaluation (1 mois) 📊

**Critères de décision pour PostgreSQL** :

| Critère | Seuil migration | Mesure actuelle |
|---------|----------------|-----------------|
| Volume dispositifs | > 100k | ~10k |
| Requêtes complexes/jour | > 10k | ~1k |
| Temps réponse moyen | > 500ms | ~100ms |
| Besoin intégrité FK critique | Oui | Moyen |

**Décision** :
- Si critères < seuils → **Rester sur MongoDB normalisé** (probabilité 60-70%)
- Si critères > seuils → **Migrer vers PostgreSQL** (probabilité 30-40%)

#### Phase 3 (optionnelle) : Migration PostgreSQL (2 mois) 🔄

**Si nécessaire après évaluation** :

**Avantages de la normalisation préalable** :
- ✅ Structure déjà normalisée → mapping 1:1 vers PostgreSQL
- ✅ Requêtes déjà adaptées aux JOINs
- ✅ Modèle de données validé
- ✅ Effort réduit de 20% (17 semaines vs 21 semaines)
- ✅ Risque divisé par 2 (migrations séquentielles vs big bang)

**Effort Phase 3** : 7 semaines (vs 21 semaines en migration directe)

---

### Pourquoi normaliser MongoDB facilite la migration PostgreSQL

#### 1. **Schéma déjà normalisé** ✅

```typescript
// MongoDB normalisé (Phase 1)
dispositifs: { _id, status, theme, mainSponsor }
dispositif_translations: { dispositifId, language, content }

// PostgreSQL (Phase 3) = Mapping 1:1
CREATE TABLE dispositifs (id, status, theme_id, main_sponsor_id);
CREATE TABLE dispositif_translations (dispositif_id, language, content);
```

#### 2. **Requêtes déjà adaptées** ✅

```typescript
// MongoDB normalisé : Agrégations avec $lookup
const result = await DispositifModel.aggregate([
  { $lookup: { from: "dispositif_translations", ... } }
]);

// PostgreSQL : JOINs (même logique)
SELECT * FROM dispositifs d
LEFT JOIN dispositif_translations dt ON dt.dispositif_id = d.id;
```

#### 3. **Pas de "big bang"** ✅

```
Sans normalisation : MongoDB imbriqué → PostgreSQL normalisé
= 2 changements simultanés ❌ Risque × 2

Avec normalisation : MongoDB imbriqué → MongoDB normalisé → PostgreSQL
= 2 changements séquentiels ✅ Risque ÷ 2
```

#### 4. **Optionalité = valeur stratégique** 🎯

```
Normalisation MongoDB → Évaluation → Décision

Si MongoDB suffit :
  ✅ Économie de 7 semaines + 0 risque migration PostgreSQL
  
Si PostgreSQL nécessaire :
  ✅ Migration facilitée + risque réduit
```

---

### Recommandation finale

**Stratégie gagnant-gagnant** :

1. **Maintenant → +3 mois** : Normalisation MongoDB (Phase 1)
2. **+3 mois → +4 mois** : Évaluation performance/besoins (Phase 2)
3. **+4 mois → +6 mois** : Migration PostgreSQL **SI nécessaire** (Phase 3)

**Probabilité de ne jamais avoir besoin de PostgreSQL** : 60-70%

**Conclusion** : La normalisation MongoDB n'est pas seulement une amélioration, c'est **une assurance** qui réduit le risque et facilite une future migration PostgreSQL si elle devient nécessaire.

---

## Date d'analyse

Cette analyse a été réalisée le 6 novembre 2025 en complément des analyses de structure de données et d'impact sur le cycle de vie.

**Documents liés** :
- `dispositif-data-structure-critique.md` - Recommandations de normalisation MongoDB
- `dispositif-data-structure-critique-lifecycle-impact.md` - Impact sur le cycle de vie
