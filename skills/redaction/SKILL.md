---
name: redaction
description: Transforme une fiche Data Inclusion en contenu Réfugiés.info en langage clair. Use when the user invokes /redaction, requests rewriting, editorial transformation, A1/A2 plain-language drafting, or Markdown RI adaptation.
---

# Rédaction en langage clair

Transformer une fiche Data Inclusion en fiche Réfugiés.info lisible pour des publics allophones A1/A2.

## Déclencheurs

- Commande historique : `/redaction`.
- Demande de réécriture en langage clair.
- Demande de transformation éditoriale d'une fiche DI en Markdown Réfugiés.info.
- Demande d'adaptation d'un contenu vers les rubriques RI.

## Entrée attendue

- Une fiche Data Inclusion au format JSON.
- Éventuellement le résultat d'audit déjà produit en amont.

## Corpus à consulter

Consulter le corpus `agent-knowledge` indexé par `qmd`, en priorité :

- `memory-blocks/transformation-langage-clair.md` pour le cadre de transformation.
- `memory-blocks/regles-redaction-langage-clair.md` pour les règles éditoriales.
- `memory-blocks/format-sortie-transformation.md` pour le format Markdown attendu.
- `memory-blocks/lexique-vif.md` et `langage-clair/DITP-Lexique-Administratif.md` pour simplifier les termes administratifs.
<!-- Note : Le nom du fichier ci-dessous contient une coquille d'origine (« Charte éditorial ») préservée pour des raisons de fidélité à la source. -->
- `langage-clair/[Charte éditorial] Réfugiés.info.md` et `langage-clair/[personas] bpi.md` si la cible éditoriale doit être précisée.

## Procédure

1. Extraire les informations utiles du JSON source.
2. Réécrire uniquement à partir des données présentes.
3. Appliquer les règles de langage clair, de structure Markdown et de directives RI.
4. Produire le Markdown attendu par le format de sortie transformation.
5. Ajouter un journal d'avertissements si le contenu source est insuffisant ou ambigu.

## Contraintes

- Ne pas inventer de procédure, prérequis, test, lieu, calendrier ou financeur.
- Ne pas mentionner les dates d'inscription, la gratuité, le financeur ou les informations déjà portées par les métadonnées.
- Ne pas générer les métadonnées `metadata_ri` sauf demande explicite de la phase `/metadata`.
- Ne pas modifier le runtime applicatif : ce skill décrit uniquement le comportement attendu du Playground migré.
