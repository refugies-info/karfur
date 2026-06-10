---
name: translate
description: Prépare la traduction d’un contenu Réfugiés.info issu du Playground. Use when the user invokes /translate, requests translation, multilingual adaptation, or translated-content verification for an RI record.
---

# Traduction de contenu Réfugiés.info

Préparer ou vérifier la traduction d'une fiche Réfugiés.info produite par les phases précédentes.

## Déclencheurs

- Commande historique : `/translate`.
- Demande de traduction d'une fiche RI.
- Demande d'adaptation multilingue ou de vérification d'une traduction.
- Besoin de préserver les directives Markdown RI pendant traduction.

## Entrée attendue

- Un Markdown Réfugiés.info issu de la phase `/redaction` ou du pipeline.
- Éventuellement le frontmatter `metadata_ri` à préserver sans traduction structurelle.
- Une langue cible explicitement indiquée par l'utilisateur ou le contexte d'appel.

## Corpus à consulter

Consulter le corpus `agent-knowledge` indexé par `qmd`, en priorité :

- `memory-blocks/format-sortie-transformation.md` pour préserver la structure Markdown RI.
- `memory-blocks/regles-redaction-langage-clair.md` pour conserver le niveau de langue clair.
<!-- Note : Le nom du fichier ci-dessous contient une coquille d'origine (« administatif ») préservée pour des raisons de fidélité à la source. -->
- `memory-blocks/lexique-vif.md` et `langage-clair/[Lexique] administatif maison de la sagesse.md` pour les termes administratifs sensibles.
- `langage-clair/[personas] bpi.md` si la cible utilisateur doit guider le ton.

## Procédure

1. Identifier la langue source, la langue cible et les sections à traduire.
2. Préserver le frontmatter YAML, les directives remark, les ancres HTML et la hiérarchie Markdown.
3. Traduire les contenus utilisateur en langage clair, sans complexifier le texte.
4. Conserver les noms propres, organismes, URLs, emails, numéros et valeurs de métadonnées sauf instruction contraire.
5. Signaler les passages ambigus plutôt que les réinterpréter.

## Contraintes

- Ne pas traduire les clés techniques du frontmatter ou des directives Markdown.
- Ne pas modifier les métadonnées structurées.
- Ne pas ajouter d'informations absentes du contenu source.
- Ne pas modifier le runtime applicatif : ce skill décrit uniquement le comportement attendu du Playground migré.
