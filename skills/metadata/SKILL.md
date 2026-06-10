---
name: metadata
description: Mappe les métadonnées d’une fiche Data Inclusion vers metadata_ri. Use when the user invokes /metadata, requests metadata extraction, validation, provenance, or Réfugiés.info YAML frontmatter.
---

# Mapping des métadonnées Réfugiés.info

Produire le frontmatter `metadata_ri` et la traçabilité de provenance à partir d'une fiche Data Inclusion.

## Déclencheurs

- Commande historique : `/metadata`.
- Demande d'extraction ou de validation des métadonnées RI.
- Demande de génération du frontmatter YAML `metadata_ri`.
- Demande de tableau de provenance Data Inclusion vers Réfugiés.info.

## Entrée attendue

- Une fiche Data Inclusion au format JSON.
- Éventuellement un Markdown rédigé par la phase `/redaction`.

## Corpus à consulter

Consulter le corpus `agent-knowledge` indexé par `qmd`, en priorité :

- `memory-blocks/mapping-metadonnees-di.md` pour les règles de mapping DI vers RI.
- `memory-blocks/schema-metadata-ri.md` pour le contrat `metadata_ri` courant.
- `memory-blocks/format-sortie-metadonnees.md` pour le format de restitution.
- `metadatas/base-connaissance.md`, `metadatas/mapping-data-di.md` et `metadatas/dispositif-letta.json` pour les valeurs autorisées et exemples de structure.

## Procédure

1. Extraire les champs source DI utiles.
2. Mapper chaque champ vers le schéma `metadata_ri` courant.
3. Construire la provenance avec les champs source, valeurs brutes et statuts.
4. Vérifier les enums, types et formes attendues avant sortie.
5. Produire le frontmatter YAML et le tableau de traçabilité.

## Contraintes

- Utiliser `sessions`, pas `periode`, pour les dates de session.
- Utiliser les valeurs `publicStatus` acceptées en minuscules : `asile`, `refugie`, `subsidiaire`, `temporaire`, `apatride`, `french`.
- Conserver `frequency.hours` comme nombre scalaire et `commitment.hours` comme tableau.
- Ne pas inventer de valeur absente ou impossible à déduire ; marquer les champs incertains dans la provenance.
- Ne pas modifier le runtime applicatif : ce skill décrit uniquement le comportement attendu du Playground migré.
