# Feature Specification: Dispositif Origin Metadata

**Feature Branch**: `003-dispositif-origin-meta`
**Created**: 2025-11-18
**Status**: Draft
**Input**: User description: "support a new \"origin\" metadata item in the \"dispositifs\" collection which distinguishes dispositifs originating from the current editorial process \"RI\" and those originating from a new AI assisted process which will be developed separately \"RCO\". The origin metadata item needs to be communicated to the frontend so it can handle these new items correctly. Existing queries and data types used by the frontend also need to include the origin metadata."

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Frontend receives the origin context (Priority: P1)

Public users navigating the catalogue (web or mobile) must receive dispositifs that include their origin metadata so the UI can adapt the presentation (e.g., display badges, educational copy, or experimental flows) without degrading discovery.

**Why this priority**: Without origin metadata the frontend cannot distinguish RCO-generated content, risking inconsistent messaging or surfacing unreviewed entries.

**Independent Test**: Mock the API response for dispositif lists and confirm the UI receives `origin` for each record and renders the expected badge/treatment.

**Acceptance Scenarios**:

1. **Given** a published dispositif stored with origin `RI`, **When** the catalogue API is queried, **Then** the response object includes `origin: "RI"` alongside existing fields and the UI renders it without regression.
2. **Given** a dispositif created through the RCO pipeline, **When** the same API is queried, **Then** the response contains `origin: "RCO"` and the UI can branch logic without additional requests.

---

### User Story 2 - _Deferred_: Admin/backoffice dashboards exclude RCO entries (Priority: P2)

This capability will be addressed in a later specification focused on blocking editorial and translation workflows for `origin = RCO`. It is noted here to preserve context but remains out of scope for the current delivery.

**Why this priority**: When picked up, it will prevent teams from acting on AI-generated content before tooling is ready.

**Status**: Deferred. Acceptance scenarios will be defined when the dedicated workflow feature is scoped.

---

### User Story 3 - Frontend client maintains backward compatibility (Priority: P3)

The Next.js frontend that consumes server APIs must continue to function without schema breaks while gaining access to the origin metadata for new UI treatments.

**Why this priority**: Any disruptive schema change could break user-facing experiences; the origin field must be additive and follow existing type contracts.

**Independent Test**: Execute current frontend queries (SSR/static props and client fetches) and confirm responses remain valid while exposing the new field through updated types.

**Acceptance Scenarios**:

1. **Given** the existing frontend without schema updates, **When** it fetches dispositifs, **Then** the payload remains backward compatible (origin defaults to `RI` when absent) so no runtime errors occur.
2. **Given** frontend components updated to use the new field, **When** they request data, **Then** the origin property is populated according to stored values without additional round-trips.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- What happens when historical dispositifs lack the origin field? → Default to `RI` during migration and in read operations so legacy items stay visible.
- How does system handle invalid origin values? → Reject write operations that send values outside the approved enum (`RI`, `RCO`) and log validation errors.
- How are drafts or archived items treated? → Origin remains immutable per record and travels with state changes, including archiving or duplication flows.

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The dispositifs collection MUST persist a required `origin` attribute constrained to the enum `{ "RI", "RCO" }` for all records created or updated after launch.
- **FR-002**: Historical dispositifs without `origin` MUST automatically resolve to `RI` (default) in both database migration and read-model serializers so no nulls leak to clients.
- **FR-003**: All dispositif creation pipelines (manual editorial, imports, future AI-assisted flows) MUST result in a stored origin value at creation time; updates MUST forbid changing origin after initial assignment to preserve provenance. Existing pipelines may remain unchanged if the backend layer injects the correct default (`RI`) whenever no origin is supplied.
- **FR-004**: Every API and query that currently returns dispositifs to the frontend (catalogue lists, detail pages, search endpoints, favorites, recommendations, sitemap builders) MUST include the `origin` field in their payloads and type contracts.
- **FR-005**: Exports and analytics queries involving dispositifs MUST expose the origin field for filtering and aggregation. (Note: Backoffice UI updates to display this field are explicitly out of scope for this iteration).
- **FR-006**: Validation layers MUST reject requests containing origin values outside the enum, and error messaging MUST explain acceptable values for client developers.
- **FR-007**: Documentation for API consumers and frontend types MUST be updated so the new field is discoverable and included in type-safe interfaces.

### Key Entities _(include if feature involves data)_

- **Dispositif**: Represents an integration resource published on Réfugiés.info. Key business attributes now include `origin` (immutable enum), `status`, `translations`, `themes`, `needs`, and timestamps. Origin links each record to either the legacy editorial process (RI) or the AI-assisted pipeline (RCO).
- **Origin**: Conceptual enum capturing content provenance. `RI` = human-curated editorial workflow; `RCO` = AI-assisted creation path. Used across APIs, admin tooling, analytics, and compliance reporting.

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 100% of API responses that include dispositifs also include a non-null `origin` field within one week of release.
- **SC-002**: 0 schema validation errors related to invalid origin values are observed in production after the first week (alerts configured to notify if violated).
- **SC-003**: Editorial reviewers can identify the origin of any dispositif within a single UI interaction (no more than one click) during acceptance testing.
- **SC-004**: Analytics exports accurately break down dispositif counts by origin with less than 1% discrepancy between database snapshots and reporting dashboards.

## Assumptions & Constraints

- Existing dispositifs will be backfilled to `origin = RI` via migration scripts; no manual editor action required.
- The RCO pipeline will write records directly into the dispositifs collection and can set the origin flag at creation time.
- No differential access control is required for RCO content at this stage; behavioral differences (badges, review queues) are handled downstream via the exposed metadata.
- Excluding `origin = RCO` records from admin/backoffice dashboards is intentionally deferred to a later specification focused on editorial workflow changes.
- Monitoring specific to RCO-origin ingestion is deferred until that pipeline goes live; current scope only needs validation tied to the RI default backfill.
