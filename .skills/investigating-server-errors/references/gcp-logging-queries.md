# GCP Logging Queries

Copy-paste queries for common error investigation scenarios.

## Backend 5xx Errors by Endpoint

```bash
# Replace "endpoint-path" with actual path (e.g., "notification_settings")
# Replace "TIMESTAMP" with ISO datetime (e.g., "2023-10-26T10:35:00Z")
gcloud logging read '
resource.type="cloud_run_revision"
resource.labels.service_name="backend-prod"
resource.labels.location="europe-west1"
httpRequest.requestUrl=~"ENDPOINT_PATH"
httpRequest.status>=500
timestamp >= "TIMESTAMP"
' --project=refugies-info --limit=50 --format='table(timestamp,httpRequest.status,httpRequest.requestMethod,httpRequest.requestUrl)'
```

## Stderr Errors (Stack Traces)

```bash
# All stderr errors in last hour
gcloud logging read '
resource.type="cloud_run_revision"
resource.labels.service_name="backend-prod"
resource.labels.location="europe-west1"
logName="projects/refugies-info/logs/run.googleapis.com%2Fstderr"
severity>=ERROR
timestamp >= "'$(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ)'"
' --project=refugies-info --limit=50 --format='table(timestamp,textPayload)'
```

## JSON Payload Errors

```bash
# Errors with structured jsonPayload
# Replace "TIMESTAMP" with actual ISO datetime
gcloud logging read '
resource.type="cloud_run_revision"
resource.labels.service_name="backend-prod"
resource.labels.location="europe-west1"
logName="projects/refugies-info/logs/run.googleapis.com%2Fstderr"
severity>=ERROR
jsonPayload.message=~"error-pattern"
timestamp >= "TIMESTAMP"
' --project=refugies-info --limit=50 --format='json' | jq -r '.[] | "\(.timestamp) | \(.jsonPayload.message)"'
```

## Timestamp Tips

- **Specific time**: `"2023-10-26T10:35:00Z"`
- **Last hour (macOS)**: `"'$(date -u -v-1H +%Y-%m-%dT%H:%M:%SZ)'"`
- **Last hour (Linux)**: `"'$(date -d '1 hour ago' -u +'%Y-%m-%dT%H:%M:%SZ')'"`
- **Last 15 minutes (macOS)**: `"'$(date -u -v-15M +%Y-%m-%dT%H:%M:%SZ)'"`
- **Last 15 minutes (Linux)**: `"'$(date -d '15 minutes ago' -u +'%Y-%m-%dT%H:%M:%SZ')'"`

## Service Names

| Environment | Backend | Frontend |
|-------------|---------|----------|
| Production | `backend-prod` | `frontend-prod` |
| Staging | `backend-stag` | `frontend-stag` |

Note: Do NOT use `backend-staging` or `frontend-staging` — these are incorrect.

## Cloud Run Deployment Info

```bash
# Check service deployment timestamp
gcloud run services describe backend-prod \
  --region=europe-west1 \
  --project=refugies-info \
  --format='value(status.conditions)'

# View recent revisions
gcloud run revisions list \
  --service=backend-prod \
  --region=europe-west1 \
  --project=refugies-info \
  --limit=5
```
