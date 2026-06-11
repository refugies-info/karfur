---
name: redaction
description: Transforme une fiche Data Inclusion en contenu Réfugiés.info en langage clair. Use when the user invokes /redaction, requests rewriting, editorial transformation, A1/A2 plain-language drafting, or Markdown RI adaptation.
---

# Rédaction en langage clair

Transformer une fiche Data Inclusion en fiche Réfugiés.info lisible pour des publics allophones A1/A2.

Le skill remplace la commande historique `/redaction` du Playground Agathe. Il couvre uniquement la phase 2 : transformation éditoriale en langage clair. Les phases audit, métadonnées et traduction restent déclenchées par leurs skills dédiés.

## Déclencheurs

- Commande historique : `/redaction`.
- Demande de réécriture en langage clair.
- Demande de transformation éditoriale d'une fiche DI en Markdown Réfugiés.info.
- Demande d'adaptation d'un contenu vers les rubriques RI.
- Sortie d'audit `compliant: true` (ou `false` pour documentation interne) en amont.

## Entrée attendue

- Une fiche Data Inclusion au format JSON.
- Éventuellement le résultat d'audit déjà produit en amont.
- Ne pas demander de clarification si un JSON exploitable est présent : produire la fiche avec les avertissements explicites.

## Corpus à consulter

Consulter le corpus `agent-knowledge` indexé par `qmd`, en priorité :

- `memory-blocks/transformation-langage-clair.md` pour le cadre de transformation.
- `memory-blocks/regles-redaction-langage-clair.md` pour les règles éditoriales.
- `memory-blocks/format-sortie-transformation.md` pour le format Markdown attendu.
- `memory-blocks/lexique-vif.md` pour les simplifications lexicales les plus fréquentes.
- `langage-clair/DITP-Lexique-Administratif.md` pour expliciter un sigle ou un terme administratif rare.
- `langage-clair/[Charte éditoriale] Réfugiés.info.md` et `langage-clair/[personas] bpi.md` si la cible éditoriale ou le persona doit être précisé.
- `langage-clair/[PROCESS] Cas éditoriaux et jurisprudence.md` pour les cas limites de gratuité, de modèle commercial ou de cadrage éditorial.
- `langage-clair/[Schéma] Fiche dispositif RI data.json` comme contrat de structure cible.
- `exemples-redaction/` pour récupérer un exemple de transformation similaire via `qmd multi-get`.

Utiliser le skill `qmd` pour rechercher puis récupérer les sources complètes (`qmd get` / `qmd multi-get`) avant de trancher un cas ambigu. Ne pas rédiger à partir d'extraits de recherche seuls.

## Procédure

1. Extraire les informations utiles du JSON source sans le modifier.
2. Mapper les champs DI vers le schéma `langage-clair/[Schéma] Fiche dispositif RI data.json`.
3. Identifier les champs absents ou incertains (lieu, lien d'inscription, dates, documents requis).
4. Réécrire uniquement à partir des données présentes, sans extrapoler.
5. Appliquer les règles de langage clair, de structure Markdown et les directives `:::toggle`, `:::important` et `:::good-to-know`.
6. Vérifier que le titre, la description introductive et les accordéons respectent la structure standard.
7. Générer le Journal des Avertissements en fin de fiche pour les manques et libertés éditoriales.
8. Ne pas lancer les phases audit, métadonnées ou traduction sauf demande explicite.

## Audience cible et ton

- Public allophone A1/A2, en situation souvent précaire, lisant sur smartphone.
- Vouvoiement obligatoire.
- Ton neutre, bienveillant, rassurant, pratique, sans emoji dans la sortie finale.
- Privilégier les phrases nominales et l'infinitif pour la section `## Comment faire ?` (`Contacter`, `Téléphoner`, `Envoyer`).
- Bannir le futur 2ᵉ personne pluriel (`vous apprendrez` → `Apprendre`) et l'impératif direct (`Téléphonez` → `Téléphoner`).
- Bannir `courriel` (utiliser `mail`) et `France Travail` sans ajouter `(anciennement Pôle emploi)`.
- Bannir tirets bas `_` et tirets cadratins `—` au profit du tiret simple `-` ou demi-cadratin `–`.
- Bannir les mots `reconnaissance officielle`, `gestes concrets`, `multisectoriel`, `plan de travail`, `programme d'apprentissage linguistique`, `vers l'emploi`, `obtenir`, `acquérir`, `pré-requis`, `FLE`, `primo-arrivant`, `être d'origine étrangère`, `codes français`, `complètement`, `parler beaucoup le français`, `socio-professionnel`, `linguistique`. Note : `FLE` est interdit en tant que sigle isolé, l'expansion `français langue étrangère` doit être utilisée à la place.
- Ne pas utiliser `son/sa/ses` : préférer `votre`, `un` ou `le` (`améliorer son français` → `améliorer votre français`).

## Structure standard de la fiche

1. Frontmatter YAML vide, qui sera enrichi par la phase `/metadata` :
   ```yaml
   ---
   ---
   ```
2. Titre informatif en `#` (verbe infinitif + action concrète).
3. Description en texte normal (2-3 phrases) : pas de titre `C'est quoi ?`, pas d'italique de résumé.
4. Bloc `:::good-to-know` après la description si une mise en garde ou un conseil utilisateur s'applique.
5. `## Pourquoi c'est intéressant ?` : au minimum 3 accordéons `:::toggle{title="…"}` (générer davantage si la matière source le permet), exemples intégrés au texte, jamais en liste à puces.
6. `## Comment faire ?` : exactement 1 accordéon `:::toggle{title="…"}` dont le titre est une action concrète (ex. `Contacter l'organisme`). Bannir les titres creux `Étape 1`, `Démarrer la formation`, `Commencer la formation`, `Suivre la formation`, `Intégrer la formation`.
7. `### Autres informations` : niveau de français, thématiques, conditions d'accès, public prioritaire (liste séparée par virgules).
8. `### Pour aller plus loin` : sources au format `- Titre – Organisme – URL`.
9. `### Journal des Avertissements` : tableau de fin avec colonnes `Type de problème`, `Champ ou élément`, `Niveau de risque` (`majeur|moyen|mineur|faible`), `Détail / justification`, `Suggestion de correction`.
10. `### Lexique` : termes administratifs ou sigles expliqués en 1-2 phrases.

Règles structurelles impératives :

- Phrases ≤ 25 mots, une idée par phrase, paragraphes courts.
- Listes numérotées réelles (`1. 2. 3.`), pas de listes paresseuses.
- Ne pas doubler les `:::` fermants et ne pas imbriquer de directives.
- Hiérarchie stricte : `#` pour Titre Informatif, `##` pour les rubriques principales, `###` pour les sous-rubriques.
- Ne jamais créer de titre non défini dans la structure standard (`C'est quoi ?`, `À savoir`, etc.).
- Ne pas écrire de phrase en italique juste après le `#` H1.

## Règles sur les dates, la durée et la localisation

- Utiliser uniquement `session.periode.debut` et `session.periode.fin` (dates de la formation).
- Ne jamais utiliser `periode-inscription` dans le contenu de la fiche.
- L'ordre des clés dans le JSON peut afficher `fin` avant `debut` : se fier aux clés, pas à la position.
- Exprimer la durée en mois plutôt qu'en semaines (`environ 3 mois` au lieu de `13 semaines`).
- Tout calcul de durée (heures → mois) doit être documenté dans le Journal des Avertissements avec la formule utilisée.
- Ne pas mentionner la gratuité, le financeur, le nombre de places, ni la zone géographique : ces informations sont déjà portées par les métadonnées.

## Utilisation du lexique et de qmd

- Consulter d'abord `memory-blocks/lexique-vif.md` via `qmd get` pour les termes fréquents (`allocataire`, `justificatif`, `modalités`, `ressources`, `usager`, etc.).
- Pour un sigle ou un terme rare, ouvrir `langage-clair/DITP-Lexique-Administratif.md` ou `langage-clair/[Lexique] administratif maison de la sagesse.md` (traduction arabe si pertinent).
- Pour un sigle, expliciter la 1ʳᵉ mention dans le texte (`Le français langue étrangère (FLE), c'est…`) et garder le sigle ensuite. Pour `FLE`, suivre la règle des mots bannis ci-dessus : utiliser l'expansion `français langue étrangère` sans réutiliser le sigle seul.
- `QPV` : ne pas laisser tel quel. Chercher la définition juste avant dans le texte (`Quartier de la Politique de la Ville`) et simplifier en `Quartier prioritaire` ou expliquer dans le Lexique.
- `Lexique` final : ne lister que les termes effectivement utilisés dans la fiche.

## Journal des Avertissements

Le Journal des Avertissements est obligatoire et doit être placé juste avant le `### Lexique`. Il documente :

- les données source absentes ou ambiguës ;
- les liens ou dates potentiellement obsolètes ;
- les termes techniques non explicités faute d'information ;
- les calculs de durée ou conversions effectués ;
- toute liberté éditoriale prise pour rendre la fiche plus claire.

Niveaux :

- `majeur` : bloque la publication sans revue humaine.
- `moyen` : à corriger ou confirmer avant publication.
- `mineur` : à améliorer au cours d'une prochaine itération.
- `faible` : informatif.

## Format de sortie

- Premier caractère = `---` (frontmatter YAML vide, enrichi ensuite par `/metadata`).
- Aucune introduction, aucun résumé conversationnel, aucun bloc de code englobant la fiche.
- La fiche commence directement par le Titre Informatif en `#`.
- Aucun emoji.
- Les composants `:::toggle`, `:::important` et `:::good-to-know` sont les seuls acceptés dans cette phase. Les autres directives ne sont pas rendues par le runtime actuel.

## Contraintes

- Ne pas inventer de procédure, prérequis, test, lieu, calendrier ou financeur.
- Ne pas mentionner les dates d'inscription, la gratuité, le financeur ou les informations déjà portées par les métadonnées.
- Ne pas extrapoler à partir d'indices ambigus (`source dit "niveau A2 attendu"` ne donne pas le droit d'écrire qu'un test vérifie ce niveau).
- Ne pas générer les métadonnées `metadata_ri` sauf demande explicite de la phase `/metadata`.
- Ne pas modifier le runtime applicatif : ce skill décrit uniquement le comportement attendu du Playground migré.
