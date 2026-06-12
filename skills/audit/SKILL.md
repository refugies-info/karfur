---
name: audit
description: Audite une fiche Data Inclusion avant migration Réfugiés.info. Use when the user invokes /audit, requests editorial compliance review, duplicate detection, or Accepté/Refusé/À vérifier decision on a DI record.
---

# Audit de fiche Data Inclusion

Exécuter la phase d'audit préalable d'une fiche Data Inclusion pour Réfugiés.info.

## Déclencheurs

- Commande historique : `/audit`.
- Demande d'audit de conformité éditoriale d'une fiche DI.
- Demande de détection de doublon Réfugiés.info.
- Besoin de qualifier une fiche comme publiable, refusée, doublon ou à vérifier.

## Entrée attendue

- Une fiche Data Inclusion au format JSON, éventuellement enveloppée dans du Markdown ou du frontmatter YAML.

## Corpus à consulter

Consulter le corpus `agent-knowledge` indexé par `qmd`, en priorité :

- `memory-blocks/audit-conformite-editoriale-di.md` pour l'arbre de décision éditorial.
- `memory-blocks/detection-doublons.md` pour la qualification des doublons.
- `memory-blocks/format-sortie-audit-global.md` pour le format de restitution.
- `conformite-editoriale/jurisprudence.md` et `conformite-editoriale/Formacode.csv` si un arbitrage métier est nécessaire.

## Procédure

1. Extraire le JSON source sans modifier les données.
2. Évaluer la conformité éditoriale selon l'arbre de décision du corpus.
3. Évaluer le risque de doublon avec les règles de détection du corpus.
4. Produire une sortie structurée conforme au format d'audit.
5. Ne pas lancer les phases rédaction, métadonnées ou traduction sauf demande explicite.

## Contraintes

- Ne pas inventer de données absentes du JSON.
- Ne pas utiliser l'historique conversationnel pour conclure qu'une fiche a déjà été traitée.
- Signaler explicitement les informations manquantes ou ambiguës.
- Ne pas modifier le runtime applicatif : ce skill décrit uniquement le comportement attendu du Playground migré.
