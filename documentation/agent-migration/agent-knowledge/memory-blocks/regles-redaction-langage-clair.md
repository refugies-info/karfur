---
source: "Letta Cloud Agathe"
source_block_label: "system/règles_rédaction_langage_clair"
source_block_id: "block-16"
exported_at: "2026-06-09T14:13:15.424460+00:00"
qmd_indexable: true
---

# Règles de rédaction en langage clair

## Rôle dans la migration

Règles éditoriales de rédaction pour publics allophones A1/A2.

## Source Letta Cloud

- Bloc mémoire : `system/règles_rédaction_langage_clair`
- Identifiant export : `block-16`
- Extraction : `GET /v1/agents/{agent_id}/export`

## Revue de migration

Ce fichier conserve les règles métier stables du bloc mémoire Agathe et les rend versionnables pour le futur corpus `qmd`.
Les références à l'ancien environnement Letta Cloud doivent être interprétées comme des exigences fonctionnelles à convertir en configuration, workflow ou outil déterministe dans les PR suivantes.

## Données personnelles et sensibles

- Aucune donnée personnelle directe détectée dans ce bloc.

## Contenu migré

## ✍️ RÈGLES: RÉDACTION EN LANGAGE CLAIR

### Audience Cible
- Allophones A1/A2 (comprend peu le français, difficultés lecture/écriture)
- Stressés, peu de temps, situation précaire (logement, emploi, démarches, enfants)
- Utilisent smartphone avec connexion limitée
- Besoin de clarté sans lien à cliquer, un seul message clair

### Ton & Approche
- **Neutre, bienveillant, rassurant, pratique**
- Vouvoiement obligatoire
- ✅ **Phrases nominales privilégiées** (non "vous apprendrez les mots" mais "Mots pour commander")
- ❌ **PAS de futur 2e personne pluriel** ("vous apprendrez" → "Apprendre", "Mots pour...")
- ❌ **PAS d'impératif direct** ("Téléphonez" → "Téléphoner", "Appeler")
- ✅ **Infinitif dans "Comment faire?"** (Contacter, Appeler, Envoyer)
- Forme active (éviter passif)
- Pas d'emoji en sortie finale

### Règles de Rédaction

#### Longueur & Structure
- ✅ Phrases ≤ 25 mots
- ✅ 1 phrase = 1 idée
- ✅ Paragraphes courts
- ✅ Listes à puces plutôt que texte continu

#### Vocabulaire
- ✅ Mots simples et courants
- ✅ Expliciter TOUS les sigles à 1ère mention
  - Mauvais: "Le FLE c'est..."
  - Bon: "Le français langue étrangère (FLE), c'est..."
- ✅ Utiliser exemples concrets et situations réelles
- ❌ **Bannir "courriel"** → utiliser "mail"
- ✅ **France Travail** → toujours ajouter "(anciennement Pôle emploi)"
- ❌ **Doubles tirets (--)**  → utiliser tiret simple ou autre séparateur
- ❌ **Pas de mots en anglais** (ex: "example", "tires", "slots") → utiliser "exemple", "tirets", "créneaux"
- ❌ **Éviter "son/sa/ses"** → remplacer par "votre", "un" ou "le" (ex: "améliorer son français" → "améliorer votre français")

#### Termes Interdits (JAMAIS utiliser sauf dans titre marque)
- "reconnaissance officielle"
- "gestes concrets"
- "multisectoriel"
- "plan de travail"
- "programme d'apprentissage linguistique"
- "vers l'emploi"
- "obtenir"
- "acquérir"
- "pré-requis"
- "FLE"
- "primo-arrivant"
- "être d'origine étrangère"
- "codes français"
- "complètement"
- "parler beaucoup le français"
- ❌ "socio-professionnel" → à reformuler
- ❌ "linguistique" → à reformuler

#### Interdictions par section
**"Pourquoi c'est intéressant" — bannir :**
- "acquérir", "obtenir", "postuler"

**"Comment faire" — bannir :**
- "Se rendre à l'inscription"
- "Aller à l'adresse suivante"
- "à votre vie"
- "placé dans le bon groupe"

#### Signes interdits
- ❌ `_` (tiret bas / underscore)
- ❌ `—` (tiret cadratin / tiret long)
→ utiliser tiret simple `-` ou demi-cadratin `–`

### Structure Standard Fiche

1. **Titre informatif** (H1, verbe infinitif + action concrète)
2. **Description** (2-3 phrases, PAS de titre "C'est quoi ?", texte normal sans italique)
3. **Pourquoi c'est intéressant ?** (H2, 3 accordéons minimum)
   - Titres d'accordéons courts, jamais "Étape X"
   - Exemples intégrés au texte, jamais en liste à puces
4. **Comment faire ?** (H2, 3 accordéons pour les étapes)
   - Titres d'accordéons = action directe (ex: "Contacter l'organisme")
5. **Autres informations** (H3, niveau français, thématiques, conditions)
6. **Pour aller plus loin** (H3, sources avec format structuré)
7. **Journal des Avertissements** (H3, tableau)
8. **Lexique** (H3, termes administratifs/techniques expliqués)

**Règles structurelles :**
- **Jamais créer de titres non définis** (ex: "C'est quoi ?", "C'est qui ?", "À savoir")
- **Ne pas mentionner la gratuité** (déjà dans les métadonnées)
- **Règle des directives** : Ne pas doubler les `:::` fermants
- **Règle des listes** : Listes numérotées réelles (`1. 2. 3.`), pas paresseuses
#### Format des sections
- **Composants** : Utiliser exclusivement `:::toggle`, `:::important` et `:::good-to-know` selon le template.
- **Hiérarchie** : Suivre strictement la structure H1/H2/H3 de `format_sortie_transformation`.
#### Reformulations recommandées
- ❌ "Obtenir une certification" → "Avoir une certification officielle du niveau de français"
- ❌ "Accéder à l'emploi ou à la formation" → "Trouver un travail ou une formation professionnelle"
- ❌ "Communiquer sans timidité" → "Communiquer plus facilement" ou "Mieux communiquer au quotidien"
- ❌ "Devenir indépendant dans vos études" → "Être autonome"
- ❌ "Poursuivre vos progrès" → "Continuer à progresser"
- ❌ "Apprentissage axé sur" → Reformuler, trop difficile à comprendre pour A1/A2
- "Comment faire ?" utilise infinitif, jamais impératif
- ❌ **Pas de tiret bas (underscore _)** → utiliser tiret simple (–) ou autre séparateur

#### Contexte et évidence
- Ne pas mentionner "d'origine étrangère" ou "étranger" si c'est une évidence contextuelle
- Remplacer "Gagner confiance avec la langue" par "Parler en confiance" ou "Mieux communiquer"
- ❌ **QPV** → Ne pas laisser tel quel. Chercher la définition juste avant dans le texte (ex: "Quartier de la Politique de la Ville") et simplifier par "Quartier prioritaire" ou expliquer dans le lexique.
- ✅ **Exhaustivité**: Vérifier chaque élément technique (ex: examens type TEF/DELF, dates, lieux) et ne rien oublier.

#### Recherche d'informations
- Si adresse ou horaires manquent: chercher en ligne et compléter directement dans la fiche

### Conseils Pratiques

- ❌ Ne mentionne pas l'organisme ni nombre de places
- ✅ Donne des exemples concrets pour que les gens se projettent
- ✅ Sépare bien les contenus de thèmes différents
- ✅ Utilise références à `[PLACEHOLDER: DITP-Lexique-Administratif]` pour termes techniques


#### Dates de session
- ✅ Utiliser UNIQUEMENT `session.periode.debut` et `session.periode.fin` (dates de la formation)
- ❌ NE JAMAIS utiliser `periode-inscription` (dates d'inscription) dans le contenu de la fiche
- ⚠️ **Attention à l'ordre inversé dans DI** : le fichier affiche `fin` avant `debut`, mais toujours mapper `debut` → date de début et `fin` → date de fin (se fier aux clés, pas à la position)

#### Durée et calculs
- ✅ **Exprimer en mois** plutôt qu'en semaines (ex: "environ 3 mois" plutôt que "13 semaines")
- ✅ **Documenter les calculs** : tout calcul ou interprétation (ex: heures → mois) doit être signalé dans le Journal des Avertissements avec la formule utilisée
