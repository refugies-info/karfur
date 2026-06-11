---
name: metadata
description: Mappe les métadonnées d’une fiche Data Inclusion vers metadata_ri. Use when the user invokes /metadata, requests metadata extraction, validation, provenance, or Réfugiés.info YAML frontmatter.
---

# Mapping des métadonnées Réfugiés.info

Produire le frontmatter `metadata_ri` et la traçabilité de provenance à partir d'une fiche Data Inclusion.

Le skill remplace la commande historique `/metadata` du Playground Agathe. Il couvre uniquement la phase 3 : mapping DI → `metadata_ri`, validation déterministe et provenance. Les phases audit, rédaction et traduction restent déclenchées par leurs skills dédiés.

## Déclencheurs

- Commande historique : `/metadata`.
- Demande d'extraction ou de validation des métadonnées RI.
- Demande de génération du frontmatter YAML `metadata_ri`.
- Demande de tableau de provenance Data Inclusion vers Réfugiés.info.
- Sortie de phase `/redaction` ou d'un audit `compliant: true`/`false` en amont.

## Entrée attendue

- Une fiche Data Inclusion au format JSON (obligatoire).
- Éventuellement le Markdown rédigé par la phase `/redaction` pour reprendre `titreInformatif`, `abstract` ou la liste des départements.
- Ne pas demander de clarification si un JSON exploitable est présent : produire le frontmatter avec les statuts `partial`, `missing` ou `warning` dans la provenance.

## Corpus à consulter

Consulter le corpus `agent-knowledge` indexé par `qmd`, en priorité :

- `memory-blocks/mapping-metadonnees-di.md` pour les règles de mapping DI → RI.
- `memory-blocks/schema-metadata-ri.md` pour le contrat `metadata_ri` courant.
- `memory-blocks/format-sortie-metadonnees.md` pour le format Markdown et la structure de la `provenance`.
- `memory-blocks/routeur-competences.md` pour confirmer que `/metadata` suit l'audit et la rédaction.
- `metadatas/base-connaissance.md` pour les énumérations (`theme`, `need`, `condition`, `public`, `publicStatus`, `details`, `timeUnit`, `frequencyUnit`, `timeSlots`).
- `metadatas/mapping-data-di.md` pour les correspondances DI → RI recommandées.
- `metadatas/dispositif-letta.json` pour un exemple d'objet `metadata_ri` complet.

Utiliser le skill `qmd` pour rechercher puis récupérer les sources complètes (`qmd get` / `qmd multi-get`) avant de trancher un cas ambigu. Ne pas déduire une valeur enum sans vérifier la table de `base-connaissance.md`.

## Procédure

1. Extraire les champs source DI utiles en respectant l'ordre de priorité documenté par `mapping-data-di.md`.
2. Mapper chaque champ vers le schéma `metadata_ri` courant. Pour les champs sémantiques (`theme`, `secondaryThemes`, `needs`, `public`, `timeSlots`, `conditions`), passer par les tableaux autorisés de `base-connaissance.md`.
3. Pour les coordonnées de contact (`map.phone` et `map.email`), utiliser **uniquement** `telephone` et `courriel` à la racine du JSON. Ignorer les chemins `extra.action.session[].contact-session[].coordonnees.*` qui sont des contacts internes.
4. Calculer `location` à partir de `code_postal` racine (et non `zone_eligibilite` qui est obsolète pour ce champ). Le champ `location` est un `string[] | null` : appliquer la logique IDF si le département extrait est en Île-de-France, sinon retourner un tableau contenant uniquement le département réel au format `["XX - Nom"]`.
5. Calculer `price` selon la règle financeur/conventionnement : si `extra.conventionnement = 1` et que `extra.code-financeur` est dans la liste acceptée, retourner l'objet `{ values: [0] }` (`gratuit`). Sinon la fiche est `payant` ; si `extra.action.frais-restants` contient un montant numérique explicite, retourner `{ values: [montant] }`, sinon laisser `price: null` et documenter le manque en provenance/revue (ne pas inventer un `values: [0]` qui publierait du payant comme gratuit). Utiliser `null` (pas `[]`) pour les tableaux optionnels absents.
6. Mapper `sessions` (objet `{ modalitesEntreesSorties, items }`) à partir de `extra.session.periode.debut` et `extra.session.periode.fin` au format ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`). Se fier aux clés, pas à l'ordre JSON.
7. Construire la `provenance` : pour chaque métadonnée, fournir `key`, `label`, `value`, `status` (`valid|partial|missing|warning`) et `source` (array d'objets `{ field, rawValue }`). Toujours inclure la valeur brute et le nom du champ.
8. Construire le tableau Markdown des métadonnées mappées (18 lignes, ordre imposé par `format-sortie-metadonnees.md`).
9. Ajouter la section `## ⚠️ Métadonnées incomplètes` pour les champs `partial`/`missing`/`warning` qui demandent une revue humaine.
10. Appeler l'outil `validate_metadata_ri` (ou la commande applicative qui l'enveloppe) sur le YAML produit et corriger jusqu'à `VALID`. Si l'outil n'est pas branché dans l'environnement courant, l'indiquer explicitement dans la section avertissements et ne pas inventer une validation.

## Règles impératives sur le schéma

Rappels `metadata_ri` à ne jamais enfreindre (source : `memory-blocks/schema-metadata-ri.md`) :

- `commitment.timeUnit` et `frequency.timeUnit` valent toujours `"hours"`. Bannir `"total"`, `"hour"`, `"heures"`.
- `frenchLevel` n'accepte que les valeurs CECRL valides : `alpha`, `A1`, `A2`, `B1`, `B2`, `C1`, `C2`. `A1.1` n'existe pas : mapper vers `A1`.
- `price`, `age`, `commitment`, `frequency`, `sessions` sont des objets, **jamais** des tableaux. Bannir `price: [{ values: [0] }]`, `sessions: [{ startDate: ... }]`.
- `price.values` doit être un tableau de nombres (`[0]` pour gratuit, `[50]` pour un montant). Bannir `["50"]` ou `["gratuit"]`.
- `price.details` doit être omis s'il est absent. Bannir `details: ""`.
- `frequency.hours` est un nombre unique, pas un tableau. Bannir `frequency: { hours: [4] }`.
- Les tableaux optionnels absents (`secondaryThemes`, `public`, `publicStatus`, `frenchLevel`, `timeSlots`, `conditions`) doivent valoir `null`, pas `[]`.
- `commitment.amountDetails` accepte `"between"`, `frequency.amountDetails` ne l'accepte pas.
- `commitment.hours` est un tableau (`[100]` ou `[50, 150]` si `between`), `frequency.hours` est un scalaire (`4`).
- `map` est un objet `Poi` ou un tableau de `Poi`. Pour les fiches sans adresse physique, conserver `map: null` (ou `map: []` selon le choix de la plateforme, mais jamais inventer une adresse).
- `publicStatus` accepte uniquement les valeurs minuscules `asile`, `refugie`, `subsidiaire`, `temporaire`, `apatride`, `french`.
- Pour `conditions`, n'utiliser **que** les 7 valeurs autorisées : `acte naissance`, `titre sejour`, `cir`, `bank account`, `pole emploi`, `driver license`, `school`. Toute autre mention doit être ignorée.

## Règles sur les dates et la durée

- Mapper `extra.session.periode.debut` et `extra.session.periode.fin` au format ISO 8601.
- L'ordre des clés dans le JSON peut afficher `fin` avant `debut` : se fier aux clés, pas à la position.
- `sessions.items` est un tableau d'objets `{ startDate, endDate }` (toutes les dates du fichier DI, ou `null` si aucune).
- `sessions.modalitesEntreesSorties` : `0` pour dates fixes, `1` pour entrées permanentes, `null` si inconnu. Ne pas déduire la valeur sans preuve.
- `commitment.hours` peut être un tableau `[min, max]` quand `amountDetails = "between"`. Sinon c'est un scalaire encapsulé en tableau (`[100]`).
- `frequency.hours` est un nombre unique qui décrit la cadence (ex. `4` heures par semaine).
- `frequency.frequencyUnit` accepte `day`, `week`, `month`, `trimester`, `semester`, `year`, `session` (singulier, conformément à `base-connaissance.md`).

## Règles sur les contacts

- `map.phone` ← `json["telephone"]` racine uniquement.
- `map.email` ← `json["courriel"]` racine uniquement.
- Bannir `extra.action.session[].contact-session[].coordonnees.courriel`.
- Bannir `extra.action.session[].contact-session[].coordonnees.telfixe.numtel`.
- Bannir `structure.courriel` et `structure.telephone` pour le mapping `map`.
- Les emails et téléphones du JSON racine sont souvent masqués (`contact@example.org`, `+33 X XX XX XX XX`) : c'est la valeur canonique attendue par le runtime.

## Règles sur `location`

- Source primaire : `code_postal` à la racine (et **non** `structure.code_postal`, et **non** `zone_eligibilite`).
- Le champ `location` est un `string[] | null` : retourner un tableau de chaînes, jamais une chaîne seule.
- Extraire le département selon la règle suivante (en cohérence avec `apps/client/src/data/departments.ts` qui n'expose que `2A - Corse-du-Sud` et `2B - Haute-Corse`) :
  - codes postaux `20xxx` → mapper vers `2A` si `code_postal` est inférieur à `20200` (ex. `20000`, `20100` → `2A - Corse-du-Sud`), sinon `2B` (ex. `20200`, `20290` → `2B - Haute-Corse`) ;
  - sinon prendre les 2 premiers chiffres (ex. `75012` → `75`, `69003` → `69`) ;
  - les codes `2Axxx`/`2Bxxx` sont normalisés en `2A`/`2B` directement.
- Logique IDF : départements `75`, `77`, `78`, `91`, `92`, `93`, `94`, `95` → `location` = liste des 8 départements au format `["75 - Paris", "77 - Seine-et-Marne", ...]`.
- Hors IDF : `location` = `["XX - Nom du département"]` (un seul élément).
- Si `code_postal` est absent ou ne correspond à aucun département connu, fallback sur `zone_eligibilite` et marquer un `warning` dans la provenance.
- Si la fiche est en ligne, conserver `location: "online"` (chaîne, pas tableau — cf. schéma).

## Règles sur `price`

- `price` est un objet `{ values: number[]; details?: string }` (jamais un tableau, jamais un scalaire). Toujours retourner l'objet complet.
- `extra.conventionnement = 1` ET `extra.code-financeur` ∈ financeurs acceptés de `base-connaissance.md` → `price: { values: [0] }` (gratuit).
- Sinon la fiche est `payant` : si `extra.action.frais-restants` contient un montant numérique explicite (par exemple `50` ou `"50"` convertible), retourner `price: { values: [montant] }`. Sinon, mettre `price: null` et documenter le manque en provenance (status `partial` ou `missing`) et dans la section `## ⚠️ Métadonnées incomplètes`. Ne jamais retomber sur `{ values: [0] }` dans la branche payant sans montant, ce qui publierait une offre payante comme gratuite.
- Ne pas mettre `price: { values: [1] }` ou `price: { values: [0, 1] }`.
- `price.details` est omis quand aucune précision n'est disponible (jamais `details: ""`).

## Format de sortie

- Premier caractère = `---`. Aucun texte, aucun raisonnement intermédiaire avant le frontmatter.
- Frontmatter YAML avec deux clés : `metadata_ri` (valeurs finales, validées) + `provenance` (traçabilité).
- Corps de la réponse :
  1. `## Métadonnées mappées` : tableau Markdown de 18 lignes dans l'ordre imposé par `format-sortie-metadonnees.md` (titre marque, structure, logo, en bref, thèmes, besoins, public visé, public, fréquence, niveau de français, âge, prix, durée totale, session, jours de présence, départements, conditions, zone d'action).
  2. `## ⚠️ Métadonnées incomplètes` : facultative, présente dès qu'un champ est `partial`/`missing`/`warning`.
- Le YAML final du frontmatter doit être celui retourné par `validate_metadata_ri` après corrections, jamais un YAML recomposé manuellement.

## Boucle de validation

1. Construire l'objet `metadata_ri` à partir des étapes ci-dessus.
2. Sérialiser en YAML.
3. Appeler `validate_metadata_ri` via l'outil runtime exposé par l'environnement (variable `VALIDATE_METADATA_RI_URL`, header `webhook-secret`).
4. Si l'outil retourne une erreur :
   - corriger la métadonnée fautive ;
   - reconstruire le YAML ;
   - rappeler l'outil ;
   - ne pas sortir tant que le statut n'est pas `VALID`.
5. Si l'outil n'est pas branché (URL absente, erreur 5xx, timeout) : ne pas inventer une validation. Marquer un `warning` dans la provenance, ajouter une ligne dans la section `## ⚠️ Métadonnées incomplètes` et documenter l'étape manquante.

## Contraintes

- Utiliser `sessions`, pas `periode`, pour les dates de session.
- Utiliser les valeurs `publicStatus` acceptées en minuscules : `asile`, `refugie`, `subsidiaire`, `temporaire`, `apatride`, `french`.
- Conserver `frequency.hours` comme nombre scalaire et `commitment.hours` comme tableau.
- Pour `conditions`, n'ajouter **que** les 7 valeurs autorisées ; toute autre mention est ignorée.
- Ne pas inventer de valeur absente ou impossible à déduire ; marquer les champs incertains dans la provenance.
- Ne jamais réécrire le frontmatter manuellement après une validation : repartir du YAML validé.
- Ne pas modifier le runtime applicatif : ce skill décrit uniquement le comportement attendu du Playground migré.
