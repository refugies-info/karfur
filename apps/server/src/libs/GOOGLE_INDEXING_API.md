# Google Indexing API Integration

## Overview

This module provides integration with the Google Indexing API to automatically notify Google when pages are deleted or archived, ensuring they are removed from the search index.

## Files

- `googleIndexingApi.ts` - Main service for Google Indexing API calls
- `../workflows/dispositif/updateDispositifStatus/updateDispositifStatus.ts` - Integration point

## How It Works

### When a Dispositif is Deleted or Archived

1. Admin changes dispositif status to `DELETED` or `ARCHIVED`
2. `updateDispositifStatus` workflow is triggered
3. Google Indexing API is called with the dispositif URL and `type: "URL_DELETED"`
4. Google removes the URL from its search index

### API Flow

```
updateDispositifStatus
  ↓
notifyGoogleUrlDeleted(url)
  ↓
GoogleAuth.getAccessToken()
  ↓
POST https://indexing.googleapis.com/v3/urlNotifications:publish
  ↓
Google removes URL from index
```

## Functions

### `notifyGoogleUrlDeleted(url: string): Promise<boolean>`

Notifies Google to remove a single URL from the search index.

**Parameters:**
- `url` (string) - Full URL to remove (e.g., `https://refugies.info/fr/dispositif/123`)

**Returns:**
- `boolean` - `true` if successful, `false` otherwise

**Example:**
```typescript
const success = await notifyGoogleUrlDeleted('https://refugies.info/fr/dispositif/123');
```

### `notifyGoogleUrlsDeleted(urls: string[]): Promise<number>`

Notifies Google to remove multiple URLs from the search index (with rate limiting).

**Parameters:**
- `urls` (string[]) - Array of URLs to remove

**Returns:**
- `number` - Count of successfully notified URLs

**Example:**
```typescript
const successCount = await notifyGoogleUrlsDeleted([
  'https://refugies.info/fr/dispositif/123',
  'https://refugies.info/fr/dispositif/456',
]);
```

## Configuration

### Environment Variables

Uses the same Google Cloud credentials as the Translation service (unified service account):

```bash
# Google Cloud credentials (shared by both Translation and Indexing APIs)
GCLOUD_PROJECT_ID=your-project-id
GCLOUD_PRIVATE_KEY_ID=your-key-id
GCLOUD_PKEY=your-private-key-with-escaped-newlines
GCLOUD_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GCLOUD_CLIENT_ID=your-client-id
NEXT_PUBLIC_REACT_APP_SITE_URL=https://refugies.info
```

### Service Account Setup

1. Create a Google Cloud service account in your main GCP project
2. Grant it both roles:
   - `Cloud Translation API Editor`
   - `Indexing API Editor`
3. Download the JSON key file
4. Extract credentials and set environment variables
5. Verify site ownership in Google Search Console
6. Add the service account email to Search Console with "Full" access

See `.windsurf/workflows/google-indexing-api-setup.md` for detailed setup instructions.

## Error Handling

The module gracefully handles errors:

- **Missing credentials**: Logs warning and skips notification
- **Authentication failure**: Logs error with details
- **API errors**: Logs error with HTTP status and details
- **Network errors**: Logs error with error message

All errors are caught and logged without throwing, ensuring the dispositif status update completes successfully even if Google notification fails.

## Logging

All operations are logged with context:

```typescript
// Success
[notifyGoogleUrlDeleted] Successfully notified Google { url: '...' }

// Warning (credentials not configured)
[notifyGoogleUrlDeleted] Google credentials not configured, skipping { url: '...' }

// Error
[notifyGoogleUrlDeleted] Error notifying Google { url: '...', error: '...' }
```

## Rate Limiting

When notifying multiple URLs:
- 100ms delay between requests to avoid rate limiting
- Batch operations are logged with success count

## Testing

To test the integration:

1. Ensure `GOOGLE_APPLICATION_CREDENTIALS` is set
2. Change a dispositif status to `DELETED` or `ARCHIVED`
3. Check server logs for notification status
4. Verify in Google Search Console that the URL is removed

## Dependencies

- `googleapis` (official Google client library)
- `google-auth-library` (already installed)

## Limitations

- Requires valid Google Cloud credentials
- Requires site ownership verification in Search Console
- Subject to Google's API quotas (200 URLs/day by default)
- Only works for URLs that return 404 or 410 status codes
- Asynchronous operation (fire-and-forget pattern)

## Future Enhancements

- Add retry logic with exponential backoff
- Add metrics/monitoring for API calls
- Support batch operations via queue
- Add webhook to verify removal status
