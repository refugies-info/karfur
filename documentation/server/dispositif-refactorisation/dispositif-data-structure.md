# Structure de données d'une fiche (Dispositif)

Ce document décrit la structure complète d'une fiche dans Réfugiés.info, basé sur le modèle de données MongoDB et les types TypeScript.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Types de fiches](#types-de-fiches)
3. [Structure principale](#structure-principale)
4. [Contenu et traductions](#contenu-et-traductions)
5. [Métadonnées (critères d'éligibilité)](#métadonnées-critères-déligibilité)
6. [Géolocalisation](#géolocalisation)
7. [Interactions utilisateurs](#interactions-utilisateurs)
8. [Gestion administrative](#gestion-administrative)
9. [Exemples de données](#exemples-de-données)

---

## Vue d'ensemble

Une **fiche** (ou **dispositif**) est l'unité de contenu principale de Réfugiés.info. Elle représente soit :
- Un **dispositif** : service ou aide disponible pour les réfugiés
- Une **démarche** : procédure administrative à suivre

Chaque fiche est stockée dans MongoDB dans la collection `dispositifs` et suit le modèle Mongoose défini dans `Dispositif.ts`.

---

## Types de fiches

### ContentType

```typescript
enum ContentType {
  DISPOSITIF = "dispositif",  // Service ou aide
  DEMARCHE = "demarche"       // Procédure administrative
}
```

**Différences principales** :
- **Dispositif** : contient une section `why` (Pourquoi c'est intéressant ?)
- **Démarche** : contient une section `next` (Et après ?) et `administrationName`

---

## Structure principale

### Schéma MongoDB

```typescript
{
  _id: ObjectId,
  typeContenu: "dispositif" | "demarche",
  status: DispositifStatus,
  created_at: Date,
  updatedAt: Date,
  
  // Relations
  mainSponsor: ObjectId,           // Structure principale (ref: Structure)
  theme: ObjectId,                 // Thème principal (ref: Theme)
  secondaryThemes: ObjectId[],     // Thèmes secondaires (ref: Theme)
  needs: ObjectId[],               // Besoins couverts (ref: Need)
  sponsors: Array<ObjectId | Sponsor>, // Partenaires
  
  // Auteurs et contributeurs
  creatorId: ObjectId,             // Créateur (ref: User)
  participants: ObjectId[],        // Contributeurs (ref: User)
  lastModificationAuthor: ObjectId,
  publishedAtAuthor: ObjectId,
  
  // Dates importantes
  lastModificationDate: Date,
  publishedAt: Date,
  deletionDate: Date,
  lastAdminUpdate: Date,
  
  // Statistiques
  nbVues: number,                  // Vues web
  nbVuesMobile: number,            // Vues mobile
  nbFavoritesMobile: number,       // Favoris mobile
  nbMots: number,                  // Nombre de mots
  
  // Contenu multilingue
  translations: {
    fr: TranslationContent,
    en?: TranslationContent,
    ar?: TranslationContent,
    ps?: TranslationContent,
    fa?: TranslationContent,
    ru?: TranslationContent,
    ti?: TranslationContent,
    uk?: TranslationContent
  },
  
  // Métadonnées et géolocalisation
  metadatas: Metadatas,
  map: Poi[] | null,
  
  // Gestion administrative
  adminComments: string,
  adminProgressionStatus: string,
  hasDraftVersion: boolean,
  themesSelectedByAuthor: boolean,
  webOnly: boolean,
  
  // Interactions
  suggestions: Suggestion[],
  merci: Merci[],
  avis: Avis[],
  
  // Divers
  externalLink: string,
  administrationLogo: ImageSchema,
  notificationsSent: { [lang: string]: boolean },
  draftReminderMailSentDate: Date,
  draftSecondReminderMailSentDate: Date,
  lastReminderMailSentToUpdateContentDate: Date
}
```

---

## Contenu et traductions

### TranslationContent

Chaque langue dispose de son propre contenu structuré :

```typescript
{
  content: DispositifContent | DemarcheContent,
  created_at: Date,
  validatorId: ObjectId  // Utilisateur ayant validé la traduction
}
```

### DispositifContent (Service/Aide)

```typescript
{
  titreInformatif: string,    // Titre descriptif (ex: "Apprendre le français")
  titreMarque: string,        // Nom de marque (ex: "FLE - Français Langue Étrangère")
  abstract: string,           // Résumé court (1-2 phrases)
  what: RichText,            // C'est quoi ? (HTML enrichi)
  why: {                     // Pourquoi c'est intéressant ?
    [uuid: string]: {
      title: string,
      text: RichText
    }
  },
  how: {                     // Comment faire ?
    [uuid: string]: {
      title: string,
      text: RichText
    }
  }
}
```

### DemarcheContent (Procédure)

```typescript
{
  titreInformatif: string,
  titreMarque: string,
  abstract: string,
  what: RichText,            // C'est quoi ?
  how: {                     // Comment faire ?
    [uuid: string]: {
      title: string,
      text: RichText
    }
  },
  next: {                    // Et après ?
    [uuid: string]: {
      title: string,
      text: RichText
    }
  },
  administrationName: string | null  // Nom de l'administration
}
```

### InfoSection

Structure d'une section de contenu :

```typescript
{
  title: string,      // Titre de la section
  text: RichText      // Contenu HTML enrichi
}
```

**Format RichText** : HTML avec support de :
- Titres (`<h3>`, `<h4>`)
- Paragraphes (`<p>`)
- Listes (`<ul>`, `<ol>`, `<li>`)
- Liens (`<a>`)
- Mise en forme (`<strong>`, `<em>`)
- Callouts (encadrés spéciaux)

---

## Métadonnées (critères d'éligibilité)

Les métadonnées définissent les critères d'éligibilité et les conditions d'accès au dispositif.

### Structure Metadatas

```typescript
{
  location?: "france" | "online" | string[],  // Localisation
  frenchLevel?: frenchLevelType[],            // Niveau de français requis
  age?: Age,                                   // Critères d'âge
  price?: Price,                               // Tarification
  publicStatus?: publicStatusType[],           // Statut administratif requis
  public?: publicType[],                       // Public cible
  conditions?: conditionType[],                // Documents requis
  commitment?: Commitment,                     // Engagement temporel
  frequency?: Frequency,                       // Fréquence
  timeSlots?: timeSlotType[]                   // Créneaux horaires
}
```

### Location (Localisation)

```typescript
type locationType = 
  | "france"        // Disponible partout en France
  | "online"        // En ligne uniquement
  | string[]        // Liste de codes départements (ex: ["75", "92", "93"])
```

**Exemples** :
- `"france"` : Service national
- `"online"` : Formation en ligne
- `["75", "92", "93", "94"]` : Disponible en Île-de-France

### French Level (Niveau de français)

```typescript
type frenchLevelType = "alpha" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
```

**Niveaux** :
- `alpha` : Alphabétisation (ne sait pas lire/écrire)
- `A1` : Débutant
- `A2` : Élémentaire
- `B1` : Intermédiaire
- `B2` : Intermédiaire avancé
- `C1` : Avancé
- `C2` : Maîtrise

### Age (Critères d'âge)

```typescript
{
  type: "lessThan" | "moreThan" | "between",
  ages: number[]  // [18] ou [18, 25]
}
```

**Exemples** :
- `{ type: "moreThan", ages: [18] }` : 18 ans et plus
- `{ type: "lessThan", ages: [25] }` : Moins de 25 ans
- `{ type: "between", ages: [18, 25] }` : Entre 18 et 25 ans

### Price (Tarification)

```typescript
{
  values: number[],  // [0] = gratuit, [] = montant libre, [50] = 50€, [10, 20] = entre 10 et 20€
  details?: "once" | "eachTime" | "hour" | "day" | "week" | "month" | "trimester" | "semester" | "year"
}
```

**Exemples** :
- `{ values: [0] }` : Gratuit
- `{ values: [] }` : Montant libre
- `{ values: [50], details: "month" }` : 50€ par mois
- `{ values: [10, 20], details: "hour" }` : Entre 10 et 20€ de l'heure

### Public Status (Statut administratif)

```typescript
type publicStatusType = 
  | "asile"         // Demandeur d'asile
  | "refugie"       // Réfugié
  | "subsidiaire"   // Protection subsidiaire
  | "temporaire"    // Protection temporaire
  | "apatride"      // Apatride
  | "french"        // Français / résident
```

### Public (Public cible)

```typescript
type publicType = 
  | "family"   // Familles
  | "women"    // Femmes
  | "youths"   // Jeunes
  | "senior"   // Seniors
  | "gender"   // Personnes LGBTQI+
```

### Conditions (Documents requis)

```typescript
type conditionType = 
  | "acte naissance"   // Acte de naissance
  | "titre sejour"     // Titre de séjour
  | "cir"              // Contrat d'intégration républicaine
  | "bank account"     // Compte bancaire
  | "pole emploi"      // Inscription Pôle emploi
  | "driver license"   // Permis de conduire
  | "school"           // Scolarisation
```

### Commitment (Engagement temporel)

```typescript
{
  amountDetails: "minimum" | "maximum" | "approximately" | "exactly" | "between",
  hours: number[],  // [2] ou [2, 4]
  timeUnit: "sessions" | "hours" | "half-days" | "days" | "weeks" | "months" | "trimesters" | "semesters" | "years"
}
```

**Exemples** :
- `{ amountDetails: "exactly", hours: [2], timeUnit: "hours" }` : Exactement 2 heures
- `{ amountDetails: "between", hours: [1, 3], timeUnit: "months" }` : Entre 1 et 3 mois

### Frequency (Fréquence)

```typescript
{
  amountDetails: "minimum" | "maximum" | "approximately" | "exactly",
  hours: number,
  timeUnit: "sessions" | "hours" | "half-days" | "days" | "weeks" | "months" | "trimesters" | "semesters" | "years",
  frequencyUnit: "session" | "day" | "week" | "month" | "trimester" | "semester" | "year"
}
```

**Exemple** :
- `{ amountDetails: "exactly", hours: 2, timeUnit: "hours", frequencyUnit: "week" }` : 2 heures par semaine

### Time Slots (Créneaux horaires)

```typescript
type timeSlotType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
```

---

## Géolocalisation

### Poi (Point of Interest)

Chaque fiche peut avoir plusieurs points d'intérêt géolocalisés :

```typescript
{
  title: string,          // Nom du lieu
  address: string,        // Adresse complète
  city?: string,          // Ville
  lat: number,            // Latitude
  lng: number,            // Longitude
  description?: string,   // Description
  email?: string,         // Email de contact
  phone?: string          // Téléphone
}
```

**Exemple** :
```json
{
  "title": "Centre d'accueil Paris 18e",
  "address": "12 rue de la Chapelle, 75018 Paris",
  "city": "Paris",
  "lat": 48.8915,
  "lng": 2.3599,
  "description": "Ouvert du lundi au vendredi de 9h à 17h",
  "email": "contact@centre-paris18.fr",
  "phone": "01 23 45 67 89"
}
```

---

## Interactions utilisateurs

### Merci

Les utilisateurs peuvent remercier une fiche :

```typescript
{
  created_at: Date,
  userId?: ObjectId  // Optionnel si utilisateur anonyme
}
```

### Avis

Les utilisateurs peuvent donner un avis positif ou négatif :

```typescript
{
  created_at: Date,
  userId?: ObjectId,
  anonymousUserId?: string,  // UUID pour utilisateurs anonymes
  avis: boolean,             // true = positif, false = négatif
  language: string           // Langue de l'interface lors de l'avis
}
```

### Suggestion

Les utilisateurs peuvent suggérer des améliorations :

```typescript
{
  created_at: Date,
  userId?: ObjectId,
  read: boolean,                    // Lu par un admin ?
  suggestion: string,               // Texte de la suggestion
  suggestionId: string,             // UUID unique
  section: string                   // Section concernée (ex: "what", "how")
}
```

---

## Gestion administrative

### Sponsor (Partenaire)

```typescript
{
  name: string,
  logo?: string,    // URL du logo
  link?: string     // URL du site web
}
```

### Administration Logo

Pour les démarches administratives :

```typescript
{
  imgId: string | null,
  public_id: string | null,
  secure_url: string
}
```

### Champs administratifs

| Champ | Type | Description |
|-------|------|-------------|
| `adminComments` | `string` | Commentaires internes pour les admins |
| `adminProgressionStatus` | `string` | Statut de progression (libre) |
| `hasDraftVersion` | `boolean` | Indique si une version brouillon existe |
| `themesSelectedByAuthor` | `boolean` | Thèmes choisis par l'auteur (vs admin) |
| `webOnly` | `boolean` | Visible uniquement sur le web (pas dans l'app mobile) |
| `notificationsSent` | `object` | Notifications envoyées par langue |
| `draftReminderMailSentDate` | `Date` | Date du 1er rappel brouillon |
| `draftSecondReminderMailSentDate` | `Date` | Date du 2e rappel brouillon |
| `lastReminderMailSentToUpdateContentDate` | `Date` | Date du rappel de mise à jour |

---

## Exemples de données

### Exemple 1 : Dispositif - Cours de français

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "typeContenu": "dispositif",
  "status": "Actif",
  "mainSponsor": "507f191e810c19729de860ea",
  "theme": "63286a015d31b2c0cad9960d",
  "secondaryThemes": [],
  "needs": ["613721a409c5190dfa70d057"],
  "creatorId": "507f191e810c19729de860eb",
  "participants": ["507f191e810c19729de860eb"],
  "publishedAt": "2024-01-15T10:00:00.000Z",
  "nbVues": 1250,
  "nbVuesMobile": 890,
  "nbMots": 450,
  "translations": {
    "fr": {
      "content": {
        "titreInformatif": "Apprendre le français",
        "titreMarque": "FLE - Français Langue Étrangère",
        "abstract": "Des cours de français gratuits pour tous les niveaux, du débutant à l'avancé.",
        "what": "<p>Le FLE (Français Langue Étrangère) propose des cours de français adaptés à votre niveau...</p>",
        "why": {
          "uuid-1": {
            "title": "Améliorer votre français",
            "text": "<p>Progresser rapidement avec des professeurs qualifiés...</p>"
          }
        },
        "how": {
          "uuid-2": {
            "title": "S'inscrire",
            "text": "<p>1. Venez au centre d'accueil<br>2. Passez un test de niveau<br>3. Choisissez votre créneau</p>"
          }
        }
      },
      "created_at": "2024-01-15T10:00:00.000Z",
      "validatorId": "507f191e810c19729de860eb"
    },
    "en": {
      "content": {
        "titreInformatif": "Learn French",
        "titreMarque": "FLE - French as a Foreign Language",
        "abstract": "Free French courses for all levels, from beginner to advanced.",
        "what": "<p>FLE (French as a Foreign Language) offers French courses adapted to your level...</p>",
        "why": {
          "uuid-1": {
            "title": "Improve your French",
            "text": "<p>Progress quickly with qualified teachers...</p>"
          }
        },
        "how": {
          "uuid-2": {
            "title": "Register",
            "text": "<p>1. Come to the reception center<br>2. Take a level test<br>3. Choose your time slot</p>"
          }
        }
      },
      "created_at": "2024-01-20T14:30:00.000Z",
      "validatorId": "507f191e810c19729de860ec"
    }
  },
  "metadatas": {
    "location": ["75", "92", "93", "94"],
    "frenchLevel": ["alpha", "A1", "A2"],
    "age": {
      "type": "moreThan",
      "ages": [16]
    },
    "price": {
      "values": [0]
    },
    "publicStatus": ["asile", "refugie", "subsidiaire"],
    "timeSlots": ["monday", "tuesday", "wednesday", "thursday", "friday"]
  },
  "map": [
    {
      "title": "Centre FLE Paris 18e",
      "address": "12 rue de la Chapelle, 75018 Paris",
      "city": "Paris",
      "lat": 48.8915,
      "lng": 2.3599,
      "email": "contact@fle-paris.fr",
      "phone": "01 23 45 67 89"
    }
  ],
  "merci": [
    {
      "created_at": "2024-02-01T15:30:00.000Z",
      "userId": "507f191e810c19729de860ed"
    }
  ],
  "avis": [
    {
      "created_at": "2024-02-05T10:15:00.000Z",
      "userId": "507f191e810c19729de860ee",
      "avis": true,
      "language": "fr"
    }
  ],
  "hasDraftVersion": false,
  "themesSelectedByAuthor": true,
  "webOnly": false
}
```

### Exemple 2 : Démarche - Demande de titre de séjour

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "typeContenu": "demarche",
  "status": "Actif",
  "mainSponsor": "507f191e810c19729de860ea",
  "theme": "63286a015d31b2c0cad9960e",
  "needs": ["613721a409c5190dfa70d058"],
  "creatorId": "507f191e810c19729de860eb",
  "publishedAt": "2024-01-10T09:00:00.000Z",
  "nbVues": 3450,
  "nbMots": 680,
  "translations": {
    "fr": {
      "content": {
        "titreInformatif": "Demander un titre de séjour",
        "titreMarque": "Titre de séjour",
        "abstract": "Comment faire votre première demande de titre de séjour en France.",
        "what": "<p>Le titre de séjour est un document officiel qui vous autorise à rester en France...</p>",
        "how": {
          "uuid-1": {
            "title": "Prendre rendez-vous",
            "text": "<p>Connectez-vous sur le site de votre préfecture...</p>"
          },
          "uuid-2": {
            "title": "Préparer les documents",
            "text": "<ul><li>Passeport</li><li>Justificatif de domicile</li><li>Photos d'identité</li></ul>"
          }
        },
        "next": {
          "uuid-3": {
            "title": "Après le dépôt",
            "text": "<p>Vous recevrez un récépissé qui vous autorise à rester en France pendant l'instruction...</p>"
          }
        },
        "administrationName": "Préfecture"
      },
      "created_at": "2024-01-10T09:00:00.000Z",
      "validatorId": "507f191e810c19729de860eb"
    }
  },
  "metadatas": {
    "location": "france",
    "publicStatus": ["asile", "refugie"],
    "conditions": ["acte naissance", "bank account"]
  },
  "administrationLogo": {
    "imgId": "prefecture_logo",
    "public_id": "logos/prefecture",
    "secure_url": "https://res.cloudinary.com/refugies-info/image/upload/v1/logos/prefecture.png"
  },
  "hasDraftVersion": false,
  "themesSelectedByAuthor": false,
  "webOnly": false
}
```

---

## Validation et contraintes

### Champs obligatoires

**Pour tous les dispositifs** :
- `typeContenu`
- `status`
- `creatorId`
- `translations.fr` (au minimum le français)
- `translations.fr.content.titreInformatif`
- `translations.fr.content.abstract`
- `translations.fr.content.what`
- `translations.fr.content.how` (au moins une section)

**Pour les dispositifs uniquement** :
- `translations.fr.content.why` (au moins une section)

**Pour les démarches uniquement** :
- `translations.fr.content.next` (au moins une section)

### Limites

| Champ | Limite |
|-------|--------|
| `titreInformatif` | 100 caractères recommandés |
| `titreMarque` | 80 caractères recommandés |
| `abstract` | 200 caractères recommandés |
| `what` | 500 mots recommandés |
| Sections `why`, `how`, `next` | 300 mots par section recommandés |
| `map` | 10 POI maximum recommandés |

### Règles de validation

1. **Complétude** : Une fiche est considérée complète si elle a :
   - Tous les champs obligatoires remplis
   - Au moins un thème (`theme`)
   - Au moins un besoin (`needs`)
   - Une structure principale (`mainSponsor`)

2. **Traductions** : 
   - Le français est obligatoire
   - Les autres langues sont optionnelles
   - Chaque traduction doit avoir la même structure de sections

3. **Métadonnées** :
   - Si `location` est un tableau, il doit contenir des codes départements valides (01-95, 2A, 2B)
   - Si `age.type` est "between", `ages` doit contenir exactement 2 valeurs
   - Si `price.values` contient 2 valeurs, elles doivent être dans l'ordre croissant

---

## Relations avec d'autres collections

### Structure (mainSponsor, sponsors)

```typescript
{
  _id: ObjectId,
  nom: string,
  acronyme?: string,
  picture?: ImageSchema,
  link?: string,
  status: "Actif" | "En attente" | "Supprimé"
}
```

### Theme (theme, secondaryThemes)

```typescript
{
  _id: ObjectId,
  name: { fr: string, en: string, ... },
  short: { fr: string, en: string, ... },
  mainColor: string,
  icon: ImageSchema,
  position: number
}
```

### Need (needs)

```typescript
{
  _id: ObjectId,
  fr: { text: string },
  en: { text: string },
  theme: ObjectId
}
```

### User (creatorId, participants, lastModificationAuthor)

```typescript
{
  _id: ObjectId,
  username: string,
  email: string,
  roles: string[],
  picture?: ImageSchema
}
```

---

## Fichiers sources

Cette documentation est basée sur les fichiers suivants :

**Modèles TypeScript** :
- `apps/server/src/typegoose/Dispositif.ts` - Modèle Mongoose principal
- `packages/api-types/src/modules/dispositif.ts` - Types API
- `packages/api-types/src/generics.ts` - Types génériques et enums

**Repository** :
- `apps/server/src/modules/dispositif/dispositif.repository.ts` - Requêtes MongoDB

---

## Notes techniques

### Index MongoDB

Les index suivants sont recommandés pour optimiser les performances :

```javascript
// Index principaux
db.dispositifs.createIndex({ status: 1, publishedAt: -1 })
db.dispositifs.createIndex({ theme: 1, status: 1 })
db.dispositifs.createIndex({ "metadatas.location": 1, status: 1 })
db.dispositifs.createIndex({ typeContenu: 1, status: 1 })

// Index pour la recherche
db.dispositifs.createIndex({ 
  "translations.fr.content.titreInformatif": "text",
  "translations.fr.content.abstract": "text"
})

// Index pour les statistiques
db.dispositifs.createIndex({ creatorId: 1, status: 1 })
db.dispositifs.createIndex({ mainSponsor: 1, status: 1 })
```

### Taille moyenne

- **Dispositif simple** : ~5-10 KB
- **Dispositif avec traductions** : ~30-50 KB
- **Dispositif complet (8 langues + POI)** : ~80-120 KB

### Performance

- **Temps de lecture** : < 50ms (avec index)
- **Temps d'écriture** : < 100ms
- **Temps de recherche** : < 200ms (avec index texte)

---

## Date de génération

Cette documentation a été générée le 6 novembre 2025 à partir de la codebase du serveur (`apps/server`).

**Note** : En cas de modifications du modèle de données, cette documentation devra être mise à jour en conséquence.
