# Exploration de la structure des Dispositifs : Index et guide de lecture

## 📋 Contexte de cette exploration

### Pourquoi cette analyse maintenant ?

Les chantiers en cours de Réfugiés.info nous poussent vers une **normalisation progressive de nos données** :

- **Brique B** : Nouvelle architecture modulaire nécessitant une structure de données plus robuste et scalable
- **Partenariat Data-Inclusion** : Intégration avec l'écosystème national demande une cohérence et une normalisation strictes
- **Chantier changement de nom** : Refonte identitaire qui est l'occasion d'améliorer les fondations techniques

Ces initiatives convergent vers un besoin commun : **une structure de données plus solide, normalisée et maintenable**.

### Enjeux identifiés

La structure actuelle des dispositifs présente des **limitations** qui risquent de devenir des **blocages** :

- 📊 **Scalabilité** : Documents MongoDB pouvant dépasser 16MB (arrays illimités)
- 🔍 **Performance** : Requêtes lentes sans index optimisés
- 📝 **Audit** : Pas de traçabilité complète des changements (RGPD)
- 🌐 **Interopérabilité** : Difficultés d'intégration avec partenaires externes
- 🛠️ **Maintenabilité** : Code métier complexe avec logique distribuée

### Objectif de cette exploration

Fournir une **analyse stratégique complète** pour guider les décisions techniques et les priorités de refactoring.

---

## 🎯 Questions stratégiques

Cette série de documents analyse en profondeur la structure de données des dispositifs (fiches) dans la codebase Réfugiés.info. L'exploration répond à trois questions stratégiques :

1. **Quel est l'état de notre codebase au niveau de la structure des Dispositifs ?**
   - Analyse détaillée du modèle de données actuel
   - Identification des problèmes structurels
   - Évaluation contre les standards backend

2. **Comment améliorer la structure actuelle ?**
   - Recommandations de refactoring
   - Plan de normalisation MongoDB
   - Impact sur le cycle de vie

3. **Est-il possible et souhaitable de migrer vers PostgreSQL ?**
   - Comparaison MongoDB vs PostgreSQL
   - Analyse coûts/bénéfices
   - Stratégie progressive recommandée

---

## 📚 Guide de lecture

### 1. **dispositif-data-structure.md**
**Résumé** : Documentation complète de la structure actuelle des dispositifs

- Modèle MongoDB actuel avec tous les champs
- Types TypeScript et interfaces API
- Relations entre collections (structures, thèmes, besoins)
- Métadonnées (localisation, français, âge, prix, conditions)
- Système de traductions multilingues (8 langues)
- Gestion des brouillons et snapshots
- Statistiques et interactions (avis, mercis, suggestions)

**À lire si** : Vous avez besoin de comprendre la structure actuelle en détail

---

### 2. **dispositif-data-structure-critique.md**
**Résumé** : Analyse critique et recommandations de refactoring

**Problèmes identifiés** (10 critiques + 5 additionnels) :
- **D1** : Données imbriquées non normalisées (arrays illimités)
- **D2** : Absence d'index documentés
- **D3** : Pas de valeurs par défaut
- **D4** : Schéma Mongoose incomplet
- **D5** : Statistiques redondantes et manuelles
- **D6** : Arrays sans limite (participants, translations)
- **D7** : État OK_STRUCTURE inutilisé
- **D8** : Pas d'event sourcing
- **D9** : Pas de versioning
- **D10** : Soft delete sans TTL

**Recommandations** :
- Normalisation : Créer collections séparées (translations, avis, merci, suggestions, events)
- Indexation : Index composites sur status, theme, location, typeContenu
- Valeurs par défaut : Initialiser tous les champs optionnels
- Event sourcing : Tracer tous les changements
- TTL index : Auto-suppression après 90 jours

**Bénéfices** :
- Performance × 3-5
- Scalabilité × 5-10
- Maintenabilité améliorée

**À lire si** : Vous voulez comprendre les problèmes structurels et les solutions recommandées

---

### 3. **dispositif-lifecycle.md**
**Résumé** : Documentation complète du cycle de vie des dispositifs

**États possibles** (9 statuts) :
- DRAFT, WAITING_STRUCTURE, WAITING_ADMIN, UPDATE_TO_VALIDATE
- OK_STRUCTURE, KO_STRUCTURE, ACTIVE, ARCHIVED, DELETED

**Phases du cycle de vie** :
1. **Création** : Initialisation en DRAFT
2. **Modification** : Édition avec système de brouillon
3. **Publication** : Transitions d'état selon rôles
4. **Validation structure** : Acceptation/rejet par sponsor
5. **Archivage/Suppression** : Fin de vie

**Workflows détaillés** :
- Gestion des brouillons (clonage, fusion, suppression)
- Invalidation des traductions lors de modifications
- Notifications et snapshots
- Intégration Google Indexing API
- Endpoints API complets

**À lire si** : Vous avez besoin de comprendre les workflows actuels et les transitions d'état

---

### 4. **dispositif-data-structure-critique-lifecycle-impact.md**
**Résumé** : Impact des recommandations de refactoring sur le cycle de vie

**Impact par phase** :

| Phase | Impact | Complexité |
|-------|--------|------------|
| Création | ⚠️ Moyen | +30% code |
| Modification | ⚠️ Élevé | +50% code |
| Publication | ⚠️ Élevé | +40% code |
| Validation | ✅ Faible | +10% code |
| Suppression | ⚠️ Moyen | +20% code |

**Changements majeurs** :
- Création : Ajouter étape pour créer translation FR séparée
- Modification : Gérer translations séparées + événements
- Publication : Fusion brouillon plus complexe avec transactions
- Brouillon : Plus léger (< 100KB vs > 1MB)
- Traductions : Invalidation plus performante

**Plan de migration** (8 semaines) :
1. Préparation : Créer collections + index (2 semaines)
2. Migration données : Dual-write (2 semaines)
3. Bascule lecture : Vers nouvelles collections (1 semaine)
4. Nettoyage : Arrêter dual-write (1 semaine)

**À lire si** : Vous voulez comprendre comment les recommandations affectent les workflows actuels

---

### 5. **dispositif-migration-postgres.md**
**Résumé** : Analyse complète de la migration vers PostgreSQL

**Verdict** : ✅ **Normalisation MongoDB d'abord, PostgreSQL ensuite (si nécessaire)**

**Stratégie progressive en 3 phases** :

**Phase 1 : Normalisation MongoDB (2-3 mois)** 🚀 RECOMMANDÉ
- Résout 80% des problèmes
- Risque faible
- Facilite future migration PostgreSQL

**Phase 2 : Évaluation (1 mois)** 📊
- Critères : Volume (> 100k), requêtes (> 10k/jour), latence (> 500ms)
- Décision : Rester MongoDB (60-70%) ou migrer PostgreSQL (30-40%)

**Phase 3 : Migration PostgreSQL (2 mois, optionnelle)** 🔄
- Seulement si critères dépassés
- Effort réduit de 20% grâce à normalisation préalable
- Risque divisé par 2

**Arguments PostgreSQL** :
- ✅ Intégrité référentielle native
- ✅ Requêtes SQL plus lisibles
- ✅ Transactions ACID robustes
- ✅ Schéma structuré avec validation
- ✅ Full-text search natif

**Arguments MongoDB normalisé** :
- ✅ Flexibilité schéma
- ✅ Performance documents
- ✅ Équipe déjà formée
- ✅ Risque migration faible

**Scores** :
- Migration directe PostgreSQL : **4/10** (risque trop élevé)
- Normalisation MongoDB puis PostgreSQL : **8.5/10** (gagnant-gagnant)

**À lire si** : Vous évaluez la possibilité d'une migration vers PostgreSQL

---

## 🎯 Conclusion

### État actuel de la codebase

La structure des dispositifs fonctionne mais présente des **problèmes structurels importants** :
- Données imbriquées sans limite (risque > 16MB)
- Pas d'index optimisés (requêtes lentes)
- Pas d'event sourcing (audit difficile)
- Gestion des traductions complexe et inefficace

### Recommandations prioritaires

**Court terme (1-2 mois)** :
1. ✅ Retirer état OK_STRUCTURE (impact nul, gain clarté)
2. ✅ Ajouter index (impact nul, gain performance)
3. ✅ Documenter plan de migration

**Moyen terme (3-6 mois)** :
1. ⚠️ Normaliser translations (impact élevé mais nécessaire)
2. ⚠️ Implémenter event sourcing (améliore audit)
3. ⚠️ Séparer avis/merci (améliore scalabilité)

**Long terme (6-12 mois)** :
1. 🔍 Évaluer PostgreSQL (si volume × 10)
2. 🔍 CQRS complet (si performance insuffisante)

### Stratégie recommandée

**Approche gagnant-gagnant en 3 phases** :

```
Maintenant → +3 mois : Normalisation MongoDB
+3 mois → +4 mois : Évaluation performance/besoins
+4 mois → +6 mois : Migration PostgreSQL SI nécessaire
```

**Bénéfices** :
- ✅ Résout 80% des problèmes immédiatement
- ✅ Facilite future migration PostgreSQL
- ✅ Possibilité de ne jamais migrer (60-70%)
- ✅ Risque divisé par 2
- ✅ Effort réduit de 20%

### Prochaines étapes

1. **Valider** cette stratégie avec l'équipe
2. **Planifier** Phase 1 (normalisation MongoDB)
3. **Prioriser** les problèmes critiques (D1, D2, D8)
4. **Créer** les collections séparées et index
5. **Migrer** les données progressivement

---

## 📖 Ordre de lecture recommandé

Pour une compréhension progressive :

1. **Ce README** (vue d'ensemble)
2. **dispositif-data-structure.md** (comprendre l'état actuel)
3. **dispositif-data-structure-critique.md** (identifier les problèmes)
4. **dispositif-lifecycle.md** (comprendre les workflows)
5. **dispositif-data-structure-critique-lifecycle-impact.md** (évaluer l'impact)
6. **dispositif-migration-postgres.md** (explorer l'alternative PostgreSQL)

---

## 📅 Date de cette exploration

6 novembre 2025

**Auteur** : Analyse complète de la codebase Réfugiés.info

**Contexte** : Évaluation stratégique de la structure des données et des options de refactoring/migration
