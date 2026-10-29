# Webhook API Documentation

The Webhook API allows external services (like Strapi) to create or update content in the Karfur database.

## Authentication & Security

### Headers
All requests must include the following header:
- **`webhook-secret`**: Must match the `WEBHOOK_SECRET` environment variable defined in the client application.

### IP Whitelisting
Requests are restricted to IP addresses defined in the `ALLOWED_WEBHOOK_IPS` environment variable.
- **Production**: Must contain the public IP(s) of the calling service.
- **Development**: If the variable is not set, IP verification is skipped.

### Enums
- **Origin**: "RI", "RCO".

### Role-Based Access Control
The API verifies the user based on the `email` field in the payload.
- **Admin / Contrib**: Can perform all actions (`create`, `update`, `archive`, `translation`).
- **Expert Trad / Trad**: Can only update translations (`translation`).

---

## Endpoints

### 1. Create Dispositif
Creates a new dispositif record with initial translations.

- **URL**: `/api/webhook/dispositif/create`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "email": "exemple@email.com",
    "dispositif": {
      "origin": "RI", // Mandatory ("RI" or "RCO")
      "theme": "63286a015d31b2c0cad99615", // Optional - Main theme ObjectId
      "secondaryThemes": ["63286a025d31b2c0cad99616"], // Optional - Secondary theme ObjectIds
      "sponsors": [ // Optional - Sponsors/partners
        {
          "name": "Alliance Française",
          "logo": "https://example.com/logo.png",
          "link": "https://example.com"
        }
      ],
      "translations": {
        "fr": {
          "content": {
            "titreInformatif": "Ouvrir l'école aux parents...",
            "titreMarque": "OEPRE",
            "abstract": "",
            "markdown": "### Objectif de la formation\n\n..."
          }
        }
      },
      "metadatas": {
        "location": "france",
        "frenchLevel": ["A1", "A2"],
        "age": { "type": "between", "ages": [18, 65] },
        "price": { "values": [0], "details": "month" },
        "publicStatus": ["refugie", "asile"],
        "public": ["family"],
        "conditions": ["titre sejour"],
        "commitment": { "amountDetails": "approximately", "hours": [10], "timeUnit": "weeks" },
        "frequency": { "amountDetails": "exactly", "hours": 5, "timeUnit": "hours", "frequencyUnit": "week" },
        "timeSlots": ["monday", "wednesday"],
        "sessions": [
          {
            "startDate": "2025-11-24T00:00:00.000Z",
            "endDate": "2026-01-16T00:00:00.000Z",
            "registrationStartDate": "2025-10-01T00:00:00.000Z",
            "registrationEndDate": "2025-11-20T23:59:59.000Z",
            "externalRef": "585188",
            "url": "https://example.com/session/585188"
          }
        ]
      }
    }
  }
  ```

> [!NOTE]
> `status` is automatically set to `ACTIF` (ACTIVE) and `typeContenu` to `dispositif`.

### 2. Update Editorial Content
Updates the main editorial content (French) and metadata of an existing dispositif.
> [!NOTE]
> The `status` is automatically set to `ACTIF` (ACTIVE) after an update, effectively reactivating archived content.

- **URL**: `/api/webhook/dispositif/update`
- **Method**: `POST` or `PATCH`
- **Payload**:
  ```json
  {
    "email": "exemple@email.com",
    "dispositif": {
      "_id": "60f7b1b5b5b5b5b5b5b5b5b5", // Must be a valid MongoDB ObjectId (24 hex characters)
      "theme": "63286a015d31b2c0cad99615", // Optional - Main theme ObjectId
      "secondaryThemes": ["63286a025d31b2c0cad99616"], // Optional - Secondary theme ObjectIds
      "sponsors": [ // Optional - Sponsors/partners
        {
          "name": "Alliance Française",
          "logo": "https://example.com/logo.png",
          "link": "https://example.com"
        }
      ],
      "translations": {
        "fr": {
          "content": {
            "titreInformatif": "Updated Title...",
            "titreMarque": "Updated Brand...",
            "abstract": "",
            "markdown": "Updated markdown content..."
          }
        }
      },
      "metadatas": { // Optional - All metadata fields
        "location": ["75 - Paris"],
        "frenchLevel": ["B1"],
        "age": { "type": "between", "ages": [18, 65] },
        "price": { "values": [0] },
        "sessions": [
          {
            "startDate": "2025-11-24T00:00:00.000Z",
            "endDate": "2026-01-16T00:00:00.000Z"
          }
        ]
      }
    }
  }
  ```

### 3. Update Translation
Updates a specific translation for an existing dispositif. This uses MongoDB dot notation to avoid overwriting other languages.

- **URL**: `/api/webhook/dispositif/translation`
- **Method**: `POST` or `PATCH`
- **Payload**:
  ```json
  {
    "email": "exemple@email.com",
    "dispositif": {
      "_id": "60f7b1b5b5b5b5b5b5b5b5b5b5", // Must be a valid MongoDB ObjectId (24 hex characters)
      "translations": {
        "uk": {
          "content": {
            "titreInformatif": "Залучення батьків до освіти дітей...",
            "titreMarque": "OEPRE",
            "abstract": "",
            "markdown": "## Мета навчання\n\n..."
          }
        }
      }
    }
  }
  ```
> [!IMPORTANT]
> Exactly one language key must be provided in the `translations` object for this endpoint.

### 4. Archive Dispositif
Archives an existing dispositif by setting its status to `Archivé`.

- **URL**: `/api/webhook/dispositif/archive`
- **Method**: `POST` or `PATCH`
- **Payload**:
  ```json
  {
    "email": "exemple@email.com",
    "dispositif": {
      "_id": "60f7b1b5b5b5b5b5b5b5b5b5" // Must be a valid MongoDB ObjectId (24 hex characters)
    }
  }
  ```

### 5. List Themes

Returns the list of available themes in id/value format. Useful to populate selectors in external tools and to build valid webhook payloads (theme names must match exactly).

- **URL**: `/api/webhook/themes`
- **Method**: `GET`
- **Response** (`200 OK`):
  ```json
  [
    { "id": "507f1f77bcf86cd799439011", "name": "Apprendre le français" },
    { "id": "507f1f77bcf86cd799439012", "name": "Emploi" }
  ]
  ```

> [!NOTE]
> Results are sorted by display position. The `name` field corresponds to `name.fr`.

---

### 6. List Needs

Returns the list of available needs in id/value format, grouped by their associated theme.

- **URL**: `/api/webhook/needs`
- **Method**: `GET`
- **Response** (`200 OK`):
  ```json
  [
    { "id": "507f1f77bcf86cd799439021", "name": "Je veux apprendre le français", "themeId": "507f1f77bcf86cd799439011" },
    { "id": "507f1f77bcf86cd799439022", "name": "Je cherche un emploi", "themeId": "507f1f77bcf86cd799439012" }
  ]
  ```

> [!NOTE]
> Results are sorted by display position. The `themeId` field allows grouping needs by theme on the client side.

---

### 7. Search Contents

Finds contents by title or id, or resolves a list of ids to display them.

- **URL**: `/api/webhook/dispositif/search`
- **Method**: `GET`
- **Query** (one of the two is required):
  - `q`: a title fragment (matches `titreInformatif` and `titreMarque`, active contents only, 20 results max) or a full ObjectId (returned whatever its status).
  - `ids`: comma-separated ObjectIds (100 max), returned whatever their status.
- **Response** (`200 OK`):
  ```json
  [
    {
      "id": "507f1f77bcf86cd799439031",
      "type": "dispositif",
      "status": "Actif",
      "titreInformatif": "Avoir une carte de séjour",
      "titreMarque": "...",
      "sponsorName": "Ministère de l'Intérieur"
    }
  ]
  ```

---

### 8. Widget Configs

A widget config stores the settings of an embeddable widget. The editor is the only writer; the model is `WidgetConfig` in `@refugies-info/mongo`.

The fields depend on the `type` of the widget, which cannot be changed once created:

- `list`: a filterable list of contents (title, description, filters, manually selected / excluded contents, display options).
- `thumbnail`: a single content, chosen by its id (`dispositifId`).

All write endpoints take the editor's `email` to check their role (Admin or Contrib required); it is not stored. Unknown fields are rejected with a `400`.

#### Create — `POST /api/webhook/widget-config/create`

Example for a `list` widget (see below for a `thumbnail`).

```json
{
  "email": "exemple@email.com",
  "widgetConfig": {
    "internalTitle": "Widget Bordeaux",
    "type": "list",
    "structureName": "Association Exemple",
    "authorizedDomains": ["exemple.org"],
    "externalTitle": "Les fiches de Bordeaux",
    "displayDescription": true,
    "filters": { "departments": ["Gironde"] },
    "selectedDispositifIds": [],
    "excludedDispositifIds": [],
    "pageSize": 8,
    "sortBy": "date",
    "displayShareModule": true,
    "displayFilterBar": true,
    "filterBarOptions": ["keyword", "location"],
    "status": "inactive"
  }
}
```

Every field is required except `description`; there are no defaults.

| Field | Constraints |
|---|---|
| `internalTitle` | 150 characters max |
| `type` | `list` \| `thumbnail` |
| `structureName` | Free text, 150 characters max, not linked to the structures collection |
| `authorizedDomains` | Hostnames only (`exemple.org`), lowercased, 20 max |
| `externalTitle` | 100 characters max |
| `description` | Optional, 300 characters max, empty string clears it |
| `filters` | `{}` for no filter, see below |
| `selectedDispositifIds` / `excludedDispositifIds` | 100 max each, a content cannot be in both |
| `pageSize` | `4`, `8` or `12` |
| `sortBy` | `date`, `views`, `theme`, `location` (same keys as the search) |
| `filterBarOptions` | `keyword`, `location`, `theme`, `public`, `status`, `frenchLevel`, `age`, `language` |
| `status` | `active` \| `inactive` |

**`filters`** mirror the search parameters. A missing or empty category means "no filter"; values of a category are OR-ed, categories are AND-ed.

```json
{
  "contentTypes": ["dispositif"],
  "departments": ["Gironde"],
  "themes": ["<themeId>"],
  "needs": ["<needId>"],
  "publics": ["women"],
  "statuses": ["asile"],
  "frenchLevels": ["a"],
  "ages": ["18-25"],
  "languages": ["ar"]
}
```

`departments` takes department **names** as the search does (`"Gironde"`, not `"33"` nor `"33 - Gironde"`) and rejects anything else. Contents available in all of France are always included when a department is set. There is no city filter: the search relies on departments.

Response (`201 Created`): `{ "message": "...", "id": "...", "publicId": "..." }`. `publicId` is the stable identifier meant for the embed code.

**`thumbnail`** widgets only take the common fields (`internalTitle`, `structureName`, `authorizedDomains`, `externalTitle`, `status`) and `dispositifId`, the id of the content displayed. Every other field of a `list` widget is rejected.

```json
{
  "email": "exemple@email.com",
  "widgetConfig": {
    "internalTitle": "Widget titre de voyage",
    "type": "thumbnail",
    "structureName": "Association Exemple",
    "authorizedDomains": ["exemple.org"],
    "externalTitle": "Demander un titre de voyage",
    "dispositifId": "<dispositifId>",
    "status": "inactive"
  }
}
```

#### Update — `POST|PATCH /api/webhook/widget-config/update`

Same payload as create, with `widgetConfig._id` and only the fields to change. `type` cannot be changed, and a field that does not belong to the type of the widget is rejected with a `400`. Arrays and `filters` are replaced as a whole. `statusUpdatedAt` is refreshed only when `status` actually changes. Response (`200 OK`): `{ "message": "...", "id": "..." }`. There is no delete: set `status` to `inactive`.

#### Read — `GET /api/webhook/widget-config` and `GET /api/webhook/widget-config/{id}`

The list returns summaries (`_id`, `publicId`, `internalTitle`, `type`, `status`, `structureName`, `updatedAt`), most recently updated first. The detail returns the whole config as stored (`_id` included).

#### Preview Count — `POST /api/webhook/widget-config/preview-count`

Counts the published contents matching a set of filters, with the search rules. It does not account for manually selected or excluded contents.

- **Body**: `{ "filters": { ... } }`
- **Response** (`200 OK`): `{ "count": 5 }`

---

### 9. List All Contents

Lists every content of the `dispositifs` collection, **whatever its status** (active, archived, deleted, drafts, ...) and type (dispositif or démarche), page by page. Full documents are returned as stored, minus `__v`. Drafts being edited live in a separate collection and are not included.

- **URL**: `/api/webhook/dispositif/all`
- **Method**: `GET`
- **Query**:
  - `limit`: page size, 50 by default, 200 at most.
  - `cursor`: the `nextCursor` of the previous page. Omit it for the first page.
- **Response** (`200 OK`): `{ "items": [ ... ], "nextCursor": "507f1f77bcf86cd799439051" }`. `nextCursor` is `null` on the last page.

Loop until `nextCursor` is `null`. Pages are sorted by `_id`, so a content created while you iterate is either returned or picked up by the next run, never duplicated.

> [!WARNING]
> Documents include internal fields (`creatorId`, `participants`, `adminComments`, user feedback...). The endpoint is protected by the webhook secret; select the fields you need on the consumer side.

---

## Field Values Reference

### Location
- `"france"` - France entière
- `"online"` - En ligne
- `["75 - Paris", "77 - Seine-et-Marne", ...]` - Départements spécifiques

### French Level
`"alpha"`, `"A1"`, `"A2"`, `"B1"`, `"B2"`, `"C1"`, `"C2"`

### Age Type
- `"lessThan"` - Moins de X ans (1 valeur dans `ages`)
- `"moreThan"` - Plus de X ans (1 valeur dans `ages`)
- `"between"` - Entre X et Y ans (2 valeurs dans `ages`)

### Price Details
`"once"`, `"eachTime"`, `"hour"`, `"day"`, `"week"`, `"month"`, `"trimester"`, `"semester"`, `"year"`

### Public Status
`"asile"`, `"refugie"`, `"subsidiaire"`, `"temporaire"`, `"apatride"`, `"french"`

### Public Type
`"family"`, `"women"`, `"youths"`, `"senior"`, `"gender"`

### Conditions
`"acte naissance"`, `"titre sejour"`, `"cir"`, `"bank account"`, `"pole emploi"`, `"driver license"`, `"school"`

### Commitment/Frequency Amount Details
`"minimum"`, `"maximum"`, `"approximately"`, `"exactly"`, `"between"`

### Time Unit
`"sessions"`, `"hours"`, `"half-days"`, `"days"`, `"weeks"`, `"months"`, `"trimesters"`, `"semesters"`, `"years"`

### Frequency Unit
`"session"`, `"day"`, `"week"`, `"month"`, `"trimester"`, `"semester"`, `"year"`

### Time Slots
`"monday"`, `"tuesday"`, `"wednesday"`, `"thursday"`, `"friday"`, `"saturday"`, `"sunday"`

---

## Error Handling

The API returns standard HTTP status codes with informative JSON messages. Messages returned to the caller are written in French, as the first webhooks do.

| Status | Code | Message | Description |
| :--- | :--- | :--- | :--- |
| **400** | `Bad Request` | `Format d'email invalide`, `L'origine doit être 'RI' ou 'RCO'`, `Format ObjectId invalide`, etc. | Payload validation error (Zod). |
| **401** | `Unauthorized` | `Accès refusé : Secret invalide ou manquant` | The `webhook-secret` header is missing or incorrect. |
| **403** | `Forbidden` | `Accès refusé : IP non autorisée` | The request allows from an unauthorized IP address. |
| **403** | `Forbidden` | `Accès refusé. Rôle requis pour cette action (create) : Admin ou Contrib` | The user does not have sufficient permissions. The message names the action and the roles it requires. |
| **404** | `Not Found` | `Utilisateur non trouvé pour cet email` | The email in the payload does not match any user. |
| **500** | `Internal Server Error` | _(Variable)_ | Unexpected server error. |

---

## Preview Endpoint

Preview a dispositif content in a specific language before publishing. This endpoint renders a full HTML page with the translated interface and content.

### URL Structure

```http
POST /{locale}/dispositif/preview
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | string | Yes | Preview language (`fr`, `ar`, `uk`, `en`, `ps`, `fa`, `ti`, `ru`) |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `webhook-secret` | Yes | Must match `WEBHOOK_SECRET` environment variable |

### Payload Structure

```json
{
  "dispositif": {
    "origin": "RCO",
    "theme": "63286a015d31b2c0cad99615",
    "secondaryThemes": [],
    "needs": [],
    "sponsors": [
      {
        "name": "Alliance Française",
        "logo": "https://example.com/logo.png",
        "link": "https://example.com"
      }
    ],
    "metadatas": {
      "location": ["75 - Paris"],
      "frenchLevel": ["A1", "A2"],
      "age": { "type": "between", "ages": [18, 65] },
      "public": ["tout public"],
      "price": { "values": [0] },
      "sessions": [
        {
          "startDate": "2025-11-24T00:00:00.000Z",
          "endDate": "2026-01-16T00:00:00.000Z",
          "externalRef": "585188"
        }
      ]
    },
    "translations": {
      "fr": {
        "content": {
          "titreInformatif": "Titre français",
          "titreMarque": "Marque française",
          "abstract": "Résumé français",
          "markdown": "# Contenu FR..."
        }
      },
      "ar": {
        "content": {
          "titreInformatif": "العنوان بالعربية",
          "titreMarque": "العلامة التجارية",
          "abstract": "الملخص",
          "markdown": "# محتوى AR..."
        }
      }
    }
  }
}
```

### Example Request

**French preview:**
```bash
curl -X POST http://localhost:3000/fr/dispositif/preview \
  -H "Content-Type: application/json" \
  -H "webhook-secret: xxx" \
  -d '{"dispositif": {"origin": "RCO", "theme": "63286a015d31b2c0cad99615", "translations": {"fr": {"content": {"titreInformatif": "Cours FLE", "abstract": "...", "markdown": "# Content"}}}}}'
```

**Arabic preview:**
```bash
curl -X POST http://localhost:3000/ar/dispositif/preview \
  -H "Content-Type: application/json" \
  -H "webhook-secret: xxx" \
  -d '{"dispositif": {"origin": "RCO", "theme": "63286a015d31b2c0cad99615", "translations": {"fr": {"content": {...}}, "ar": {"content": {"titreInformatif": "...", "abstract": "...", "markdown": "..."}}}}}'
```

### Behavior

| Scenario | Result |
|----------|--------|
| Translation exists for `locale` | Displays everything in `locale` (title, abstract, content, UI) |
| Translation missing for `locale` | Falls back to French (`translations.fr` or root fields) |
| Interface language | Always matches the URL `locale` parameter |

### Important Notes

- The `locale` parameter moved from the request body to the URL path (as of 2025-02-18)
- This endpoint returns a full HTML page, not JSON
- Use the test page at `/dispositif/test-preview` (development only) for manual testing
