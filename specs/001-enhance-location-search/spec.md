# Feature Specification: Enhance Location Search UX

**Feature Branch**: `enhance-location-search`  
**Created**: 2025-10-28  
**Status**: Draft  
**Input**: User description: "Enhance the UX of the location search to allow users to find their city or department quickly by: 1) changing the default locationLabel from 'Département' to 'Ville' in the Filters component, 2) enabling search for both cities AND departments in the LocationMenu auto-suggest list, 3) keeping the final filter as a department in the URL"

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

### User Story 2 - Change Default Filter Label to "Ville" (Priority: P1)

The location filter button currently displays "Département" as the default label, which may confuse users who think they're searching for cities. Changing this to "Ville" (City) better reflects the user's mental model of the search interaction.

**Why this priority**: This is a critical UX improvement that sets proper user expectations before they interact with the location filter. It's a quick win that improves clarity.

**Independent Test**: Can be fully tested by loading the search page and verifying the location filter button displays "Ville" instead of "Département" when no location is selected.

**Acceptance Scenarios**:

1. **Given** the search page loads with no location filter applied, **When** the page renders, **Then** the location filter button displays "Ville"
2. **Given** a user has selected a location, **When** the page displays the selected location, **Then** the filter button shows the selected department name (not the default label)

---

### User Story 3 - Department Search Fallback (Priority: P2)

When users search for a department name directly (e.g., "Île-de-France"), they should see department results in the auto-suggest list, allowing them to quickly filter by department without needing to know specific city names.

**Why this priority**: This provides an alternative search path for users who prefer searching by department. It's valuable but secondary to city search since most users will search by city name first.

**Independent Test**: Can be fully tested by typing a department name (e.g., "Rhône") in the location search field and verifying that matching departments appear in the suggestion list.

**Acceptance Scenarios**:

1. **Given** the location search field is empty, **When** a user types "Rhône", **Then** "Rhône" appears in the suggestions
2. **Given** suggestions include both cities and departments, **When** a user selects a department suggestion, **Then** the department is applied as a filter and the URL is updated accordingly

---

### Edge Cases

- What happens when a user searches for a term that matches both city and department names (e.g., "Paris")? Both should appear in suggestions with clear labels.
- How does the system handle special characters in department names (e.g., "Côte-d'Or", "Alpes-de-Haute-Provence")? Search should match these correctly.
- What if the geolocation API returns no results for a search term? The system should display an empty state message.
- How does the system handle very short search queries (< 3 characters)? Currently filtered out, but should this behavior change?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST change the default location filter label from "Département" to "Ville" in the Filters component
- **FR-002**: System MUST search municipalities using `data.geopf.fr/geocodage/search?q=${search}&type=municipality` API
- **FR-003**: System MUST search departments using `geo.api.gouv.fr/departements?nom=${search}` API
- **FR-004**: System MUST merge results from both municipality and department API calls into a single auto-suggest list
- **FR-005**: System MUST display search results from both cities and departments in the auto-suggest dropdown, clearly distinguishing between them (e.g., with labels or visual indicators)
- **FR-006**: System MUST preserve the current behavior of storing the final filter as a department code in the URL query parameter
- **FR-007**: System MUST maintain the existing debounce behavior (500ms) for search input to avoid excessive API calls
- **FR-008**: System MUST continue to display common places (Paris, Lyon, Strasbourg, etc.) when the search field is empty
- **FR-009**: System MUST limit auto-suggest results to the top 5 matches to maintain UI clarity
- **FR-010**: System MUST announce search result counts to screen readers for accessibility

### Key Entities

- **Location Search Query**: User input string used to search for cities and departments
- **Search Result**: Individual city or department returned from the geolocation API, containing name, postal code, and department code
- **Department Filter**: The final selected department stored in the URL and used to filter search results
- **Common Places**: Pre-defined list of frequently searched cities with their associated departments

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can find their city or department within 3 keystrokes (e.g., typing "par" to find "Paris")
- **SC-002**: The location filter label displays "Ville" by default, improving clarity for new users
- **SC-003**: Both city and department search results appear in the auto-suggest list when applicable
- **SC-004**: The final URL filter remains a department code, maintaining backward compatibility with existing search functionality
- **SC-005**: Search response time remains under 1 second for typical queries (measured after debounce)
- **SC-006**: 100% of existing location filter functionality is preserved (no regression in current features)

## Clarifications

### Session 2025-10-28

- Q: How to search for departments in the geolocation API? → A: Use two separate API calls: `data.geopf.fr/geocodage/search?q=${search}&type=municipality` for cities and `geo.api.gouv.fr/departements?nom=${search}` for departments

## Assumptions

- The current debounce delay (500ms) is appropriate and should be maintained
- Common places list should remain unchanged
- No changes to backend API are required; all changes are client-side
- Both geolocation APIs (data.geopf.fr and geo.api.gouv.fr) are available and stable
- Department search results from geo.api.gouv.fr can be merged with municipality results from data.geopf.fr

## Dependencies

- Geolocation API (data.geopf.fr) for municipality search
- French Government API (geo.api.gouv.fr) for department search
- Existing `getDepartmentNameFromCode` utility function
- Existing translation keys for UI labels and announcements
- Current Redux store structure for search query management
