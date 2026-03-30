# Common Error Patterns in Karfur

Codebase-specific error patterns and their solutions.

## Mongoose / MongoDB Patterns

### Undefined Field on Legacy Documents

**Symptom**: `Cannot read property 'X' of undefined` or spread operator fails on optional field

**Example**: AppUser documents created before `notificationsSettings` field existed:

```typescript
// OLD CODE - fails when notificationsSettings is undefined
appUser.notificationsSettings = { ...appUser.notificationsSettings, ...payload };

// FIXED CODE - provides default before spread
const DEFAULT_NOTIFICATIONS_SETTINGS = {
  global: true,
  local: true,
  demarches: true,
  themes: {},
};
const currentSettings = appUser.notificationsSettings || DEFAULT_NOTIFICATIONS_SETTINGS;
appUser.notificationsSettings = { ...currentSettings, ...payload };
```

**Fix Pattern**: 
1. Define constant with defaults
2. Use `||` fallback before destructuring/spreading
3. Apply nested merge for sub-objects (e.g., `themes`)

### Field Type Mismatch

**Symptom**: Query returns no results or cast errors

**Example**: `membres.userId` stored as strings in MongoDB, queried as ObjectIds:

```typescript
// Check actual types in MongoDB
// Commands like: db.structuresapp.findOne({}, {membres: 1})

// Use string comparison if field stores strings
structure.membres.filter(m => m.userId === userIdString)
```

## TSOA / Controller Patterns

### Route Definition Mismatches

Endpoints defined with TSOA decorators:

```typescript
@Route("appuser")
export class AppUsersController extends Controller {
  @Get("/notification_settings")
  public async notificationSettings(...) { }
}
```

To find a controller by endpoint path:
1. Search `apps/server/src/controllers/` for the base path
2. Look for `@Get`, `@Post`, etc. with the specific endpoint
3. Trace to workflow function in `apps/server/src/workflows/`

## Error Response Patterns

### NotFoundError vs Null Returns

- Repository functions return `null` for missing documents
- Workflow functions throw `NotFoundError("message")` for API responses
- Controllers don't catch — errors bubble to global handler

## Git / Deployment Patterns

### Checking Fix Status

```bash
# Is commit in production?
git merge-base --is-ancestor <commit> production && echo "YES" || echo "NO"

# What commits are in staging but not production?
git log --oneline production..staging | head -20

# Show file at specific branch
git show <branch>:path/to/file.ts
```

### Recent Deployment Commits

```bash
# Production commits affecting server
git log --oneline production -- apps/server/src/ | head -20

# Staging commits since production
git log --oneline production..staging -- apps/server/src/
```
