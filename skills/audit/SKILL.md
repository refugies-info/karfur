---
name: audit
description: Audite une fiche Data Inclusion avant migration Réfugiés.info. Use when the user invokes /audit, requests editorial compliance review, duplicate detection, or Accepté/Refusé/À vérifier decision on a DI record.
---

# Audit de fiche Data Inclusion

Exécuter la phase d'audit préalable d'une fiche Data Inclusion pour Réfugiés.info.

Le skill remplace la commande historique `/audit` du Playground Agathe. Il couvre uniquement la phase 1 : conformité éditoriale Data Inclusion et détection de doublons Réfugiés.info. Les phases rédaction, métadonnées et traduction restent déclenchées par leurs skills dédiés.

## Déclencheurs

- Commande historique : `/audit`.
- Demande d'audit de conformité éditoriale d'une fiche DI.
- Demande de détection de doublon Réfugiés.info.
- Besoin de qualifier une fiche comme publiable, refusée, doublon ou à vérifier.

## Entrée attendue

- Une fiche Data Inclusion au format JSON, éventuellement enveloppée dans du Markdown ou du frontmatter YAML.
- Ne pas demander de clarification avant l'audit si un JSON exploitable est présent : produire un rapport avec les incertitudes explicites.

## Corpus à consulter

Consulter le corpus `agent-knowledge` indexé par `qmd`, en priorité :

- `memory-blocks/routeur-competences.md` pour confirmer que `/audit` exécute conformité et doublons indépendamment.
- `memory-blocks/audit-conformite-editoriale-di.md` pour l'arbre de décision éditorial.
- `memory-blocks/detection-doublons.md` pour la qualification des doublons.
- `memory-blocks/format-sortie-audit-global.md` pour le format de restitution.
- `conformite-editoriale/jurisprudence.md` et `conformite-editoriale/Formacode.csv` si un arbitrage métier est nécessaire.

Utiliser le skill `qmd` pour rechercher puis récupérer les sources complètes (`qmd get` / `qmd multi-get`) avant de trancher un cas ambigu. Ne pas répondre uniquement à partir d'extraits de recherche.

## Procédure

1. Extraire le JSON source sans modifier les données ni corriger silencieusement les champs.
2. Évaluer la conformité éditoriale selon l'arbre de décision séquentiel du corpus.
3. Évaluer le risque de doublon avec l'API fraîche Réfugiés.info décrite dans le corpus.
4. Produire une sortie structurée compatible avec le parsing historique.
5. Ne pas lancer les phases rédaction, métadonnées ou traduction sauf demande explicite.

## Audit de conformité éditoriale

Appliquer les six étapes dans l'ordre documenté par `memory-blocks/audit-conformite-editoriale-di.md` :

1. conventionnement ;
2. financeur ;
3. public visé ;
4. type de dispositif ;
5. durée ;
6. volume horaire.

Règles d'exécution :

- Dès qu'une étape est refusée, la décision `compliant` devient `false`.
- Continuer à documenter les informations disponibles quand cela aide l'équipe éditoriale, mais ne pas transformer un refus en acceptation par hypothèse.
- Si une donnée obligatoire est absente, indiquer la donnée manquante dans le tableau d'audit.
- Quand un rattrapage sémantique est utilisé, expliquer le raisonnement et les champs JSON qui le justifient.
- Les cas `Cas par cas` du corpus ne deviennent pas automatiquement acceptés : les traiter comme refus quand la règle source le demande et expliciter le point éditorial.

## Détection de doublons

La détection de doublons ne se fait pas avec `qmd` et ne doit pas s'appuyer sur un fichier statique exporté depuis Letta Cloud.

Quand l'outil runtime est disponible, appeler obligatoirement `search_ri_duplicate_dispositifs` avant de conclure sur `duplicate`. Cet outil est la façade agent de l'API applicative `POST https://refugies.info/api/agent/dispositifs/duplicates`, implémentée côté dépôt par le client de recherche de doublons Réfugiés.info `apps/client/src/lib/agentDuplicateSearch.ts`.

Construire la requête à partir du JSON DI :

- `title` : champ `nom` ou titre principal, obligatoire ;
- `description` : description, objectif ou contenu exploitable ;
- `structureName` : `structure.nom` ou acronyme disponible ;
- `commune` : commune ou ville principale ;
- `departments` : tableau de chaînes, par exemple `["75", "93"]`, contenant les départements extraits de `zone_eligibilite`, adresse, code postal ou contexte ;
- `limit` : `10` par défaut, `20` si la fiche est générique ou ambiguë.

Qualifier ensuite les candidats selon `memory-blocks/detection-doublons.md` : localisation comme critère éliminatoire, structure comme critère fort, contenu comme critère sémantique.

Si l'outil est indisponible, en erreur technique, non branché dans l'environnement courant ou si le titre obligatoire manque, ne pas inventer l'absence de doublon : mettre `duplicate: indeterminate` et expliquer `Recherche doublon indisponible techniquement` ou la donnée bloquante.

## Format de sortie

Le premier caractère de la réponse doit être `---`. Ne pas ajouter d'introduction, de résumé conversationnel ni de bloc de code autour du résultat.

Pour `/audit`, produire au minimum :

```yaml
---
compliant: true/false
duplicate: true/false/indeterminate
metadata_ri: null
provenance: []
---

# Rapport de traitement

<hr id="audit">

## 1. Analyse de Conformité Éditoriale

| Étape | Donnée trouvée | Décision | Justification |
| ----- | -------------- | -------- | ------------- |

**Décision conformité :** Accepté / Refusé

<hr id="doublons">

## 2. Détection de Doublons

**Statut doublon :** Nouveau / Doublon / À vérifier

| Candidat RI | Localisation | Structure | Similarité contenu | Conclusion |
| ----------- | ------------ | --------- | ------------------ | ---------- |
```

Compatibilité parsing : conserver le frontmatter YAML unique en tête et les séparateurs `<hr id="audit">` puis `<hr id="doublons">`. Les champs `metadata_ri` et `provenance` restent vides pendant cette phase pour ne pas déclencher implicitement le skill `metadata`.

Si un doublon est détecté, inclure dans la section doublons l'identifiant et l'URL complète du dispositif existant, par exemple `https://refugies.info/dispositif/{ID}`.

## Contraintes

- Ne pas inventer de données absentes du JSON.
- Ne pas utiliser l'historique conversationnel pour conclure qu'une fiche a déjà été traitée.
- Signaler explicitement les informations manquantes ou ambiguës.
- Ne pas conclure `duplicate: false` si la recherche applicative n'a pas pu être exécutée.
- Ne pas utiliser le corpus documentaire `qmd` comme substitut à la recherche de doublons applicative.
- Ne pas modifier le runtime applicatif : ce skill décrit uniquement le comportement attendu du Playground migré.
