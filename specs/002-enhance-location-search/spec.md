# Feature Specification: Enhance Location Search UX

**Feature Branch**: `enhance-location-search`  
**Created**: 2025-10-28  
**Updated**: 2025-10-29  
**Status**: Draft  
**Input**: User description: "Enhance the UX of the location search to allow users to find their city or department quickly by: 1) changing the default locationLabel from 'Département' to 'Localité' in the Filters component, 2) enabling search for both cities AND departments in the LocationMenu auto-suggest list, 3) allowing multiple location selection, 4) keeping the final filter as department codes in the URL"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick City Search with Auto-Suggest (Priority: P1)

Users want to search for their city by name and see relevant results in an auto-suggest dropdown. Currently, the search only returns municipalities, but users expect to also see department names as fallback options when searching for broader geographic areas.

**Why this priority**: This is the core UX enhancement that directly addresses the user pain point of finding locations quickly. It's the primary interaction users will perform.

**Independent Test**: Can be fully tested by typing a city name (e.g., "Paris") in the location search field and verifying that both matching cities and their corresponding departments appear in the suggestion list.

**Acceptance Scenarios**:

1. **Given** the location search field is empty, **When** a user types "Paris", **Then** "Paris" appears in the suggestions with its postal code and department code
2. **Given** the location search field is empty, **When** a user types "Rh", **Then** both cities starting with "Rh" (e.g., "Rennes") and departments containing "Rh" (e.g., "Rhône") appear in the suggestions
3. **Given** suggestions are displayed, **When** a user selects a city suggestion, **Then** the corresponding department is applied as a filter and the URL is updated with the department code

---

### User Story 2 - Change Default Filter Label to "Localité" (Priority: P1)

The location filter button currently displays "Ville" as the default label. Changing this to "Localité" (Location) better reflects the broader search capability that now includes both cities and departments.

**Why this priority**: This is a critical UX improvement that sets proper user expectations before they interact with the location filter.

**Independent Test**: Can be fully tested by loading the search page and verifying the location filter button displays "Localité" instead of "Ville" when no location is selected.

**Acceptance Scenarios**:

1. **Given** the search page loads with no location filter applied, **When** the page renders, **Then** the location filter button displays "Localité"
2. **Given** a user has selected locations, **When** the page displays the selected locations, **Then** the filter button shows the selected location names (not the default label)

---

### User Story 3 - Department Search Fallback (Priority: P2)

When users search for a department name directly (e.g., "Île-de-France"), they should see department results in the auto-suggest list, allowing them to quickly filter by department without needing to know specific city names.

**Why this priority**: This provides an alternative search path for users who prefer searching by department. It's valuable but secondary to city search since most users will search by city name first.

**Independent Test**: Can be fully tested by typing a department name (e.g., "Rhône") in the location search field and verifying that matching departments appear in the suggestion list.

**Acceptance Scenarios**:

1. **Given** the location search field is empty, **When** a user types "Rhône", **Then** "Rhône" appears in the suggestions
2. **Given** suggestions include both cities and departments, **When** a user selects a department suggestion, **Then** the department is applied as a filter and the URL is updated accordingly

---

### User Story 4 - Multi-Select Location Filter (Priority: P1)

Users want to select multiple locations (cities and/or departments) to refine their search results.

**Why this priority**: This enables more powerful search filtering by allowing combinations of locations.

**Independent Test**: Can be fully tested by:
1. Opening location search
2. Selecting multiple items
3. Verifying all selected locations appear in the filter button

**Acceptance Scenarios**:

1. **Given** the location search is open, **When** a user selects multiple items, **Then** all selected items appear in the filter button
2. **Given** multiple locations are selected, **When** the user performs a search, **Then** results are filtered to include all selected locations
3. **Given** multiple locations are selected, **When** the user clicks the filter button, **Then** all selected locations are displayed with remove options

---

### Edge Cases

- What happens when a user searches for a term that matches both city and department names (e.g., "Paris")? Both should appear in suggestions with clear labels.
- How does the system handle special characters in department names (e.g., "Côte-d'Or", "Alpes-de-Haute-Provence")? Search should match these correctly.
- What if the geolocation API returns no results for a search term? The system should display an empty state message.
- How does the system handle very short search queries (< 3 characters)? Currently filtered out, but should this behavior change?
- How are multiple selected locations displayed in the filter button when space is limited? Should truncate with "+N" indicator.
- How does the system handle removing individual locations from a multi-select? Should update URL and state immediately.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST change the default location filter label from "Ville" to "Localité" in the Filters component
- **FR-002**: System MUST search municipalities using `data.geopf.fr/geocodage/search?q=${search}&type=municipality` API
- **FR-003**: System MUST search departments using `geo.api.gouv.fr/departements?nom=${search}` API
- **FR-004**: System MUST merge results from both municipality and department API calls into a single auto-suggest list
- **FR-005**: System MUST display search results from both cities and departments in the auto-suggest dropdown, clearly distinguishing between them (e.g., with labels or visual indicators)
- **FR-006**: System MUST preserve the current behavior of storing the final filter as department codes in the URL query parameter
- **FR-007**: System MUST maintain the existing debounce behavior (500ms) for search input to avoid excessive API calls
- **FR-008**: System MUST continue to display common places (Paris, Lyon, Strasbourg, etc.) when the search field is empty
- **FR-009**: System MUST limit auto-suggest results to the top 5 matches to maintain UI clarity
- **FR-010**: System MUST announce search result counts to screen readers for accessibility
- **FR-011**: System MUST allow unlimited location selections
- **FR-012**: System MUST display all selected locations with horizontal scrolling if needed
- **FR-013**: System MUST update the URL with all selected department codes
- **FR-014**: System MUST provide a way to remove individual selected locations
- **FR-015**: System MUST maintain selection state when reopening the location menu

### Key Entities

- **Location Search Query**: User input string used to search for cities and departments
- **Search Result**: Individual city or department returned from the geolocation API, containing name, postal code, and department code
- **Department Filter**: The final selected department stored in the URL and used to filter search results
- **Common Places**: Pre-defined list of frequently searched cities with their associated departments
- **Multi-Select State**: Tracks which locations are currently selected by the user

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can find their city or department within 3 keystrokes (e.g., typing "par" to find "Paris")
- **SC-002**: The location filter label displays "Localité" by default, improving clarity for new users
- **SC-003**: Both city and department search results appear in the auto-suggest list when applicable
- **SC-004**: The final URL filter remains department codes, maintaining backward compatibility with existing search functionality
- **SC-005**: Search response time remains under 1 second for typical queries (measured after debounce)
- **SC-006**: 100% of existing location filter functionality is preserved (no regression in current features)
- **SC-007**: Users can select and filter by multiple locations simultaneously
- **SC-008**: Selected locations are clearly displayed and can be individually removed

## Clarifications

### Session 2025-10-28

- Q: How to search for departments in the geolocation API? → A: Use two separate API calls: `data.geopf.fr/geocodage/search?q=${search}&type=municipality` for cities and `geo.api.gouv.fr/departements?nom=${search}` for departments

### Session 2025-10-29

- Q: How to handle multiple department codes in URL? → A: Use comma-separated values in the `departments` query parameter (e.g., `?departments=75,69`)
- Q: How to display multiple selected locations in limited space? → A: Show first 2 items followed by "+N" indicator (e.g., "Paris, Lyon +2")

## Assumptions

- The current debounce delay (500ms) is appropriate and should be maintained
- Common places list should remain unchanged
- No changes to backend API are required; all changes are client-side
- Both geolocation APIs (data.geopf.fr and geo.api.gouv.fr) are available and stable
- Department search results from geo.api.gouv.fr can be merged with municipality results from data.geopf.fr
- Multi-select state will be maintained in client-side state and URL parameters

## Dependencies

- Geolocation API (data.geopf.fr) for municipality search
- French Government API (geo.api.gouv.fr) for department search
- Existing `getDepartmentNameFromCode` utility function
- Existing translation keys for UI labels and announcements
- Current Redux store structure for search query management
