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
      "translations": {
        "fr": {
          "content": {
            "titreInformatif": "Updated Title...",
            "titreMarque": "Updated Brand...",
            "abstract": "",
            "markdown": "Updated markdown content..."
          }
        }
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
> Results are sorted by display position. The `name` field corresponds to `name.fr` and is the value expected in the `themes` array of the create/update endpoints.

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

## Error Handling

The API returns standard HTTP status codes with informative JSON messages:

| Status | Code | Message | Description |
| :--- | :--- | :--- | :--- |
| **400** | `Bad Request` | `Format d'email invalide`, `L'origine doit être 'RI' ou 'RCO'`, `Format ObjectId invalide`, etc. | Payload validation error (Zod). |
| **401** | `Unauthorized` | `Accès refusé : Secret invalide ou manquant` | The `webhook-secret` header is missing or incorrect. |
| **403** | `Forbidden` | `Accès refusé : IP non autorisée` | The request allows from an unauthorized IP address. |
| **403** | `Forbidden` | `Accès refusé. Rôle requis : Admin ou Contrib` | The user does not have sufficient permissions. |
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
    "metadatas": {
      "location": "à distance",
      "frenchLevel": ["A1", "A2"],
      "age": { "type": "between", "ages": [18, 65] },
      "public": ["tout public"],
      "price": { "values": [0], "details": "Gratuit" },
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
  -d '{"dispositif": {"titreInformatif": "Cours FLE", "origin": "RCO", "translations": {"fr": {"content": {"titreInformatif": "Cours FLE", "abstract": "...", "markdown": "# Content"}}}}}'
```

**Arabic preview:**
```bash
curl -X POST http://localhost:3000/ar/dispositif/preview \
  -H "Content-Type: application/json" \
  -H "webhook-secret: xxx" \
  -d '{"dispositif": {"titreInformatif": "Cours FLE", "origin": "RCO", "translations": {"fr": {"content": {...}}, "ar": {"content": {"titreInformatif": "...", "abstract": "...", "markdown": "..."}}}}}'
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
