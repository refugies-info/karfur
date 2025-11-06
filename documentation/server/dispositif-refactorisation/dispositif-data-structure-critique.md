# Analyse critique de la structure de données du Dispositif

## Résumé exécutif

**Score global : 6.5/10** - La structure présente plusieurs problèmes architecturaux typiques d'une base de données qui a évolué sans refactoring majeur. Des améliorations significatives sont nécessaires pour respecter les standards backend modernes.

---

## Problèmes critiques identifiés

| ID | Catégorie | Sévérité | Problème | Impact | Recommandation |
|----|-----------|----------|----------|--------|----------------|
| **D1** | Normalisation | **CRITICAL** | Données imbriquées non normalisées (translations, suggestions, merci, avis) | Performance dégradée, difficultés de requêtage, croissance illimitée du document | Déplacer vers collections séparées |
| **D2** | Index | **CRITICAL** | Absence d'index documentés | Requêtes lentes, scan complet de collection | Créer index composites |
| **D3** | Schéma | **HIGH** | Champs optionnels sans valeurs par défaut cohérentes | Logique conditionnelle complexe, bugs potentiels | Définir valeurs par défaut explicites |
| **D4** | Type safety | **HIGH** | Union types polymorphes (`sponsors: ObjectId \| Sponsor`) | Complexité de requêtage, erreurs runtime | Séparer en champs distincts |
| **D5** | Duplication | **HIGH** | Statistiques redondantes (nbVues, nbVuesMobile) | Désynchronisation possible, calculs manuels | Utiliser agrégations MongoDB |
| **D6** | Scalabilité | **HIGH** | Arrays sans limite (participants, suggestions, avis) | Documents MongoDB > 16MB possible | Implémenter pagination/archivage |
| **D7** | État | **MEDIUM** | État `OK_STRUCTURE` inutilisé | Code mort, confusion | Retirer de l'enum |
| **D8** | Audit | **MEDIUM** | Pas de versioning des modifications | Impossible de tracer l'historique | Implémenter event sourcing ou changelog |
| **D9** | Métadonnées | **MEDIUM** | Métadonnées imbriquées complexes | Requêtes difficiles, index impossibles | Normaliser ou utiliser schéma dédié |
| **D10** | Soft delete | **LOW** | Soft delete sans TTL | Données supprimées persistent indéfiniment | Ajouter TTL index ou archivage |

---

## Analyse détaillée par problème

### D1 - Données imbriquées non normalisées (CRITICAL)

**Problème** : Arrays imbriqués (suggestions, merci, avis, translations) peuvent croître indéfiniment.

**Impact** : Document peut dépasser 16MB, performance dégradée, impossible d'indexer efficacement.

**Solution** : Déplacer vers collections séparées (dispositif_translations, dispositif_avis, dispositif_merci, dispositif_suggestions).

---

### D2 - Absence d'index documentés (CRITICAL)

**Problème** : Documentation suggère des index mais aucun n'est défini dans le code Typegoose.

**Impact** : Requêtes lentes (scan complet), performance dégradée en production.

**Solution** : Ajouter index composites dans @modelOptions ou via script de migration.

---

### D3 - Champs optionnels sans valeurs par défaut (HIGH)

**Problème** : Champs comme `theme?`, `mainSponsor?` sont optionnels mais requis pour complétude.

**Impact** : Logique conditionnelle complexe, bugs potentiels (null vs undefined).

**Solution** : Rendre obligatoires les champs requis (`required: true`) ou définir valeurs par défaut explicites.

---

### D4 - Union types polymorphes (HIGH)

**Problème** : `sponsors?: (Ref<Structure> | Sponsor)[]` mélange ObjectId et objets.

**Impact** : Populate impossible, logique conditionnelle complexe, requêtes difficiles.

**Solution** : Séparer en deux champs (`sponsorStructures`, `sponsorExternal`) ou collection séparée.

---

### D5 - Statistiques redondantes (HIGH)

**Problème** : Compteurs manuels (nbVues, nbVuesMobile) sans source de vérité unique.

**Impact** : Désynchronisation possible, race conditions, pas d'historique.

**Solution** : Collection d'événements + matérialized view avec refresh périodique.

---

### D6 - Arrays sans limite (HIGH)

**Problème** : Arrays (participants, suggestions) peuvent contenir 1000+ éléments.

**Impact** : Document > 16MB possible, pagination impossible, mémoire saturée.

**Solution** : Limiter + archiver, ou déplacer vers collections séparées avec pagination.

---

### D7 - État OK_STRUCTURE inutilisé (MEDIUM)

**Problème** : L'état `OK_STRUCTURE = "Accepté structure"` existe dans l'enum mais n'est jamais utilisé dans les workflows.

**Preuve** : Dans `structureReceiveDispositif.ts`, le workflow passe directement de `WAITING_STRUCTURE` à `WAITING_ADMIN` (accepté) ou `KO_STRUCTURE` (rejeté).

**Impact** : Code mort, confusion pour les développeurs, documentation incorrecte.

**Solution** : Retirer complètement de l'enum ou documenter explicitement avec `@deprecated` si prévu pour future feature.

---

### D8 - Pas de versioning des modifications (MEDIUM)

**Problème** : Aucun historique des modifications. On sait QUI et QUAND mais pas QUOI ni POURQUOI.

**Impact** : Impossible de tracer les changements, pas de rollback possible, audit incomplet, conformité RGPD difficile.

**Solution** : Implémenter event sourcing (collection dispositif_events) ou snapshots (collection dispositif_snapshots).

---

### D9 - Métadonnées imbriquées complexes (MEDIUM)

**Problème** : Objet `metadatas` avec 10 champs imbriqués complexes (location, age, price, etc.).

**Impact** : Requêtes complexes (`"metadatas.location": { $in: ["75"] }`), index difficiles à optimiser, validation complexe.

**Solution** : Flatten les champs au niveau racine ou créer collection séparée `dispositif_criteria`.

---

### D10 - Soft delete sans TTL (LOW)

**Problème** : Données supprimées (`status: DELETED`, `deletionDate`) persistent indéfiniment.

**Impact** : Base de données qui grossit, pas de nettoyage automatique, coûts de stockage inutiles.

**Solution** : Ajouter TTL index (expiration après 90 jours) ou archivage manuel vers collection séparée.

---

## Problèmes de conception supplémentaires

### P1 - Pas de séparation lecture/écriture (CQRS)

**Problème** : Même modèle pour lecture et écriture.

**Impact** : Requêtes de lecture lentes (joins multiples), pas d'optimisation spécifique par use case.

**Solution** : Créer read model dénormalisé (dispositifs_read) avec données pré-calculées.

---

### P2 - Pas de validation Mongoose

**Problème** : Validation uniquement au niveau TypeScript.

**Impact** : Données invalides peuvent être insérées directement en DB.

**Solution** : Ajouter validators Mongoose sur les champs critiques.

---

### P3 - Pas de hooks de lifecycle

**Problème** : Logique métier dispersée dans les services.

**Impact** : Code dupliqué, oublis possibles, difficile à maintenir.

**Solution** : Implémenter pre/post hooks pour recalcul automatique (nbMots), invalidation cache, etc.

---

### P4 - Pas de cache strategy

**Problème** : Pas de stratégie de cache documentée.

**Impact** : Requêtes répétées, performance sous-optimale, charge DB inutile.

**Solution** : Implémenter cache Redis avec TTL et stratégie d'invalidation.

---

### P5 - Pas de stratégie de pagination

**Problème** : Pas de pagination standardisée.

**Impact** : Requêtes lourdes, timeout possible, UX dégradée.

**Solution** : Implémenter cursor-based pagination (recommandé) ou offset-based pagination.

---

## Recommandations prioritaires

### Court terme (1-2 sprints)

1. **Créer les index manquants** (D2)
   - Impact immédiat sur performance
   - Facile à implémenter
   - Risque faible

2. **Retirer OK_STRUCTURE** (D7)
   - Nettoyage simple
   - Réduit confusion

3. **Ajouter valeurs par défaut** (D3)
   - Réduit bugs
   - Améliore type safety

### Moyen terme (3-6 mois)

4. **Normaliser suggestions/merci/avis** (D1)
   - Amélioration performance significative
   - Nécessite migration de données
   - Risque moyen

5. **Séparer sponsors** (D4)
   - Simplifie requêtes
   - Migration progressive possible

6. **Implémenter event sourcing** (D8)
   - Améliore audit
   - Permet rollback
   - Fondation pour CQRS

### Long terme (6-12 mois)

7. **Refactoring complet avec CQRS**
   - Séparation lecture/écriture
   - Performance optimale
   - Architecture moderne

8. **Normaliser métadonnées** (D9)
   - Requêtes simplifiées
   - Meilleure scalabilité

---

## Métriques de qualité

| Critère | Score actuel | Score cible | Gap |
|---------|--------------|-------------|-----|
| **Normalisation** | 3/10 | 8/10 | -5 |
| **Performance** | 5/10 | 9/10 | -4 |
| **Scalabilité** | 4/10 | 9/10 | -5 |
| **Maintenabilité** | 6/10 | 8/10 | -2 |
| **Type safety** | 7/10 | 9/10 | -2 |
| **Auditabilité** | 4/10 | 9/10 | -5 |

**Score global : 4.8/10** → **Cible : 8.5/10**

---

## Conclusion

La structure actuelle fonctionne mais présente des **dettes techniques significatives** qui impacteront la scalabilité et la maintenabilité à moyen terme. Les problèmes critiques (D1, D2) doivent être adressés en priorité.

**Recommandation** : Planifier un refactoring progressif sur 6-12 mois avec migration de données par étapes pour minimiser les risques.

---

---

## Exemples de code pour solutions prioritaires

### Exemple 1 : Création des index (D2)

```typescript
// Dans apps/server/src/typegoose/Dispositif.ts
@modelOptions({
  schemaOptions: {
    timestamps: { createdAt: "created_at" },
  },
  options: {
    indexes: [
      { status: 1, publishedAt: -1 },
      { theme: 1, status: 1 },
      { "metadatas.location": 1, status: 1 },
      { typeContenu: 1, status: 1 },
      { mainSponsor: 1, status: 1 },
      { creatorId: 1, status: 1 },
    ]
  }
})
export class Dispositif extends Base {
  // ...
}
```

### Exemple 2 : Normalisation des avis (D1)

```typescript
// Nouvelle collection dispositif_avis
export class DispositifAvis extends Base {
  @prop({ required: true, ref: () => Dispositif, index: true })
  public dispositifId!: Ref<Dispositif>;
  
  @prop({ ref: () => User })
  public userId?: Ref<User>;
  
  @prop()
  public anonymousUserId?: string;
  
  @prop({ required: true })
  public avis!: boolean;
  
  @prop({ required: true })
  public language!: string;
  
  @prop({ required: true })
  public created_at!: Date;
}

// Requête optimisée
const nbAvisPositifs = await DispositifAvisModel.countDocuments({
  dispositifId: id,
  avis: true
});
```

### Exemple 3 : Event sourcing pour audit (D8)

```typescript
// Collection dispositif_events
export class DispositifEvent extends Base {
  @prop({ required: true, ref: () => Dispositif })
  public dispositifId!: Ref<Dispositif>;
  
  @prop({ required: true })
  public eventType!: "created" | "updated" | "published" | "archived";
  
  @prop({ required: true, ref: () => User })
  public userId!: Ref<User>;
  
  @prop({ required: true })
  public timestamp!: Date;
  
  @prop({ type: () => Object })
  public changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
}

// Enregistrer un événement
await DispositifEventModel.create({
  dispositifId: dispositif._id,
  eventType: "updated",
  userId: user._id,
  timestamp: new Date(),
  changes: [
    { field: "status", oldValue: "DRAFT", newValue: "ACTIVE" }
  ]
});
```

### Exemple 4 : Validation Mongoose (P2)

```typescript
@prop({
  required: true,
  validate: {
    validator: (v: string) => v.length >= 10 && v.length <= 200,
    message: "Abstract doit contenir entre 10 et 200 caractères"
  }
})
public abstract!: string;

@prop({
  validate: {
    validator: function(v: string[]) {
      const validCodes = /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB])$/;
      return v.every(code => validCodes.test(code));
    },
    message: "Codes départements invalides"
  }
})
public location?: string[];
```

### Exemple 5 : Hooks de lifecycle (P3)

```typescript
// Pre-save hook pour recalcul automatique
@pre<Dispositif>('save')
async function preSave() {
  // Recalculer nbMots automatiquement
  if (this.translations?.fr?.content) {
    this.nbMots = countDispositifWords(this.translations.fr.content);
  }
}

// Post-save hook pour invalidation cache
@post<Dispositif>('save')
async function postSave(doc: Dispositif) {
  await cache.del(`dispositif:${doc._id}`);
  await eventBus.publish('dispositif.updated', { id: doc._id });
}
```

---

## Plan de migration recommandé

### Phase 1 : Quick wins (Semaine 1-2)

1. ✅ Créer les index manquants (D2)
2. ✅ Retirer OK_STRUCTURE de l'enum (D7)
3. ✅ Ajouter valeurs par défaut (D3)

**Effort** : 2-3 jours  
**Risque** : Faible  
**Impact** : Performance immédiate

### Phase 2 : Normalisation critique (Mois 1-2)

1. ✅ Créer collections séparées (avis, merci, suggestions)
2. ✅ Migrer données existantes
3. ✅ Adapter les requêtes

**Effort** : 2-3 semaines  
**Risque** : Moyen  
**Impact** : Scalabilité + Performance

### Phase 3 : Audit et monitoring (Mois 2-3)

1. ✅ Implémenter event sourcing (D8)
2. ✅ Ajouter validation Mongoose (P2)
3. ✅ Implémenter hooks lifecycle (P3)

**Effort** : 2-3 semaines  
**Risque** : Faible  
**Impact** : Auditabilité + Maintenabilité

### Phase 4 : Architecture avancée (Mois 4-6)

1. ✅ Implémenter CQRS (P1)
2. ✅ Normaliser métadonnées (D9)
3. ✅ Cache strategy (P4)

**Effort** : 1-2 mois  
**Risque** : Élevé  
**Impact** : Performance maximale

---

## Checklist de validation

### Avant migration

- [ ] Backup complet de la base de données
- [ ] Tests de performance baseline
- [ ] Plan de rollback documenté
- [ ] Environnement de staging prêt

### Pendant migration

- [ ] Migration par batch (1000 documents à la fois)
- [ ] Monitoring des performances
- [ ] Logs détaillés des erreurs
- [ ] Validation des données migrées

### Après migration

- [ ] Vérification intégrité des données
- [ ] Tests de performance comparatifs
- [ ] Validation des index créés
- [ ] Documentation mise à jour

---

## Ressources et références

### Documentation MongoDB

- [Index Best Practices](https://docs.mongodb.com/manual/indexes/)
- [Document Size Limit](https://docs.mongodb.com/manual/reference/limits/#bson-documents)
- [TTL Indexes](https://docs.mongodb.com/manual/core/index-ttl/)

### Patterns architecturaux

- [Event Sourcing Pattern](https://martinfowler.com/eaaDev/EventSourcing.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Materialized View Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/materialized-view)

### Outils

- [MongoDB Compass](https://www.mongodb.com/products/compass) - Analyse des index
- [mongo-express](https://github.com/mongo-express/mongo-express) - Interface web
- [mongostat](https://docs.mongodb.com/database-tools/mongostat/) - Monitoring

---

## Date d'analyse

Cette analyse a été réalisée le 6 novembre 2025 sur la base de la documentation et du code source du serveur (`apps/server`).

**Auteur** : Analyse automatisée basée sur les standards backend MongoDB et les best practices TypeScript/Mongoose.

**Prochaine révision recommandée** : Après implémentation de la Phase 1 (Quick wins).
