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
      "themes": ["Apprendre le français", "Santé"],
      "translations": {
        "fr": {
          "content": {
            "titreInformatif": "Ouvrir l'école aux parents...",
            "titreMarque": "OEPRE",
            "abstract": "",
            "markdown": "### Objectif de la formation\n\n..."
          }
        }
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
      "_id": "60f7b1b5b5b5b5b5b5b5b5b5",
      "themes": ["Santé"],
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
      "_id": "60f7b1b5b5b5b5b5b5b5b5b5",
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
      "_id": "60f7b1b5b5b5b5b5b5b5b5b5"
    }
  }
  ```

---

## Metadatas Support (Future Enhancement)

> [!NOTE]
> **Status**: Metadata handling via webhooks is planned for a future sprint.

Currently, the webhook API does not support sending `metadatas` (e.g., sessions, opening hours, custom fields) in the payload. However, the data model has been extended to support structured metadata for RCO-origin dispositifs.

**Planned Enhancement**:
- Add optional `metadatas` field in `DispositifCreateSchema` and `DispositifUpdateSchema`
- Support for `sessions` metadata (training course dates from Data Inclusion)
- Flexible schema using Zod `.passthrough()` to allow future metadata types without breaking changes

**Example (Future)**:
```json
{
  "email": "exemple@email.com",
  "dispositif": {
    "origin": "RCO",
    "themes": ["Apprendre le français"],
    "metadatas": {
      "sessions": [
        {
          "startDate": "2025-11-24T00:00:00Z",
          "endDate": "2026-01-16T00:00:00Z",
          "registrationStartDate": "2025-08-01T00:00:00Z",
          "registrationEndDate": "2025-11-23T00:00:00Z",
          "externalRef": "585188",
          "url": "https://example.com/session/585188"
        }
      ]
    },
    "translations": { ... }
  }
}
```

For now, metadata must be added directly in MongoDB for testing purposes.

---

## Error Handling

The API returns standard HTTP status codes with informative JSON messages:

| Status | Code | Message | Description |
| :--- | :--- | :--- | :--- |
| **400** | `Bad Request` | `Format d'email invalide`, `L'origine doit être 'RI' ou 'RCO'`, etc. | Payload validation error (Zod). |
| **401** | `Unauthorized` | `Accès refusé : Secret invalide ou manquant` | The `webhook-secret` header is missing or incorrect. |
| **403** | `Forbidden` | `Accès refusé : IP non autorisée` | The request allows from an unauthorized IP address. |
| **403** | `Forbidden` | `Accès refusé. Rôle requis : Admin ou Contrib` | The user does not have sufficient permissions. |
| **404** | `Not Found` | `Utilisateur non trouvé pour cet email` | The email in the payload does not match any user. |
| **500** | `Internal Server Error` | _(Variable)_ | Unexpected server error. |
