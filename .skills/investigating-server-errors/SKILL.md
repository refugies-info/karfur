---
name: investigating-server-errors
description: Investigates HTTP 5xx errors in Node.js backends on GCP Cloud Run. Use when users report server errors, need post-deployment verification, or ask to check production health. Triggers on "500 errors", "server errors", "investigate errors", "check logs", or post-deployment checks.
---

# Investigating Server Errors

Systematic workflow for tracing HTTP 5xx errors to root cause in Node.js/Express backends deployed on GCP Cloud Run.

## When to Use

- User reports seeing 500/502/503/504 errors
- Post-deployment verification (proactive check)
- Sentry alerts or error monitoring notifications
- User shares error screenshots or log snippets

## Investigation Workflow

### Step 1: Identify the Endpoint

Extract from user's report:
- **HTTP method**: GET, POST, PUT, DELETE
- **Path**: `/api/resource/endpoint`
- **Status code**: 500, 502, 503, or 504
- **Timing**: When did errors start? Recent deployment?

### Step 2: Find Code Path

Locate the controller and trace downstream:

```bash
# Find route definition (tsoa decorators)
grep -rn "@Route\|@Get\|@Post\|@Put\|@Delete" apps/server/src/controllers/ | grep "endpoint-name"

# Trace to service/repository
grep -rn "functionName" apps/server/src/workflows/ apps/server/src/modules/
```

Common patterns:
- `apps/server/src/controllers/*Controller.ts` - Route definitions
- `apps/server/src/workflows/*/` - Business logic
- `apps/server/src/modules/*/` - Repository/database layer

### Step 3: Check Deployment Status

Determine if a fix might already be deployed:

```bash
# Check latest production commit
git log --oneline production | head -5

# Check if fix commit is in production
git merge-base --is-ancestor <fix-commit> production && echo "Fix deployed" || echo "Fix NOT deployed"

# See commits in staging but not production
git log --oneline production..staging | head -20

# Show file content at different branches
git show production:path/to/file.ts
git show staging:path/to/file.ts
git show dev:path/to/file.ts
```

### Step 4: Query Cloud Run Logs

Check for errors since deployment or specific timeframe:

```bash
# 5xx errors on specific endpoint since deployment
# Note: Replace TIMESTAMP with actual ISO timestamp (e.g., 2023-10-26T10:35:00Z)
gcloud logging read '
resource.type="cloud_run_revision"
resource.labels.service_name="backend-prod"
resource.labels.location="europe-west1"
httpRequest.requestUrl=~"endpoint-path"
httpRequest.status>=500
timestamp >= "YYYY-MM-DDTHH:MM:SSZ"
' --project=refugies-info --limit=50 --format='json'

# Backend stderr errors (all 5xx)
# Note: Use GNU date syntax on Linux: date -d '1 hour ago' -u +'%Y-%m-%dT%H:%M:%SZ'
gcloud logging read '
resource.type="cloud_run_revision"
resource.labels.service_name="backend-prod"
resource.labels.location="europe-west1"
logName="projects/refugies-info/logs/run.googleapis.com%2Fstderr"
severity>=ERROR
timestamp >= "'$(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ)'"
' --project=refugies-info --limit=50 --format='value(timestamp,textPayload)'
```

Service names:
- `backend-prod` / `frontend-prod` - Production
- `backend-stag` / `frontend-stag` - Staging

### Step 5: Analyze Error Patterns

Common 500 error causes in this codebase:

| Pattern | Cause | Fix |
|---------|-------|-----|
| `Cannot read property 'X' of undefined` | Missing field in DB document | Add default value fallback |
| `... is not a function` | Import issue or undefined method | Check imports, add null checks |
| Spread operator on `undefined` | Optional field not initialized | `const x = value \|\| {}` |
| MongoDB connection timeout | DB pool exhaustion | Check connection limits, slow queries |

### Step 6: Verify Fix (if deployed)

```bash
# Check Cloud Run deployment timestamp
gcloud run services describe backend-prod --region=europe-west1 --project=refugies-info --format='value(metadata.annotations.serving.knative.dev/lastModifier)'

# Query for errors after fix deployment - should return empty if fixed
gcloud logging read '...' --limit=10
```

## Quick Reference

See [references/gcp-logging-queries.md](references/gcp-logging-queries.md) for copy-paste log queries.

See [references/common-patterns.md](references/common-patterns.md) for codebase-specific error patterns.

## Platform Notes

- **macOS**: Uses BSD `date` with `-v` flag (e.g., `date -u -v-1H`)
- **Linux**: Uses GNU `date` with `-d` flag (e.g., `date -d '1 hour ago' -u`)
