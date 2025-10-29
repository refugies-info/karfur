# Research: Enhance Location Search UX

**Phase**: 0 (Research)  
**Date**: 2025-10-28  
**Status**: Complete

## Objective

Verify API capabilities, document response formats, and identify implementation considerations for dual-API location search enhancement.

## API Investigation

### 1. Municipality Search API: data.geopf.fr

**Endpoint**: `https://data.geopf.fr/geocodage/search`

**Current Usage** (existing implementation):
```
GET /geocodage/search?q=Paris&type=municipality
```

**Response Format** (verified from current code):
```json
{
  "features": [
    {
      "properties": {
        "label": "Paris (75), Île-de-France",
        "context": "75, Île-de-France, France",
        "name": "Paris"
      },
      "geometry": {
        "coordinates": [2.3522, 48.8566]
      }
    }
  ]
}
```

**Key Observations**:
- Returns municipalities with postal code and department name in `context` field
- Context format: `{postal_code}, {department_name}, {country}`
- Department name can be extracted by splitting context on ", " and taking index [1]
- Supports fuzzy matching (e.g., "Par" matches "Paris")
- Response includes up to 10 results by default

### 2. Department Search API: geo.api.gouv.fr

**Endpoint**: `https://geo.api.gouv.fr/departements`

**Proposed Usage**:
```
GET /departements?nom=Rhône
```

**Response Format** (from API documentation):
```json
[
  {
    "code": "69",
    "nom": "Rhône",
    "codeRegion": "84",
    "region": "Auvergne-Rhône-Alpes"
  }
]
```

**Key Observations**:
- Returns departments matching the search term
- Includes department code (needed for final filter)
- Supports fuzzy matching
- Response is an array (not wrapped in "features")
- No pagination; returns all matching departments

### 3. API Response Merging Strategy

**Challenge**: Two different response formats need to be unified

**Solution**:
```typescript
interface UnifiedSearchResult {
  type: 'city' | 'department';
  label: string;
  deptCode: string;
  deptName: string;
  source: 'municipality' | 'department';
}
```

**Transformation Logic**:
1. Municipality results → Extract dept code from context, map to UnifiedSearchResult
2. Department results → Use code and nom directly, map to UnifiedSearchResult
3. Merge arrays and limit to 5 total results
4. Sort by relevance (exact matches first, then fuzzy matches)

## Edge Cases & Considerations

### 1. Special Characters & Accents
- **Test Case**: Search "Cote" should match "Côte-d'Or"
- **Finding**: Both APIs support accent-insensitive search
- **Action**: No special handling needed; APIs handle this

### 2. Ambiguous Names
- **Test Case**: "Paris" could match city "Paris (75)" and potentially a department
- **Finding**: "Paris" is not a department name; only city matches
- **Action**: Add visual labels to distinguish results (e.g., "Paris (75)" vs "Rhône (dept)")

### 3. Empty Results
- **Test Case**: Search "XYZABC" returns no results
- **Finding**: Both APIs return empty arrays
- **Action**: Display "No results found" message; maintain existing behavior

### 4. Short Queries
- **Current Behavior**: Search only triggers if `search.length > 2`
- **Finding**: Existing code filters out queries < 3 characters
- **Action**: Maintain this behavior; no change needed

### 5. API Availability & Errors
- **Risk**: API endpoints could be temporarily unavailable
- **Mitigation**: Add try-catch blocks; display fallback message; continue showing common places
- **Testing**: Mock API responses for unit tests

## Translation Keys

**Existing Keys** (verified in codebase):
- `Recherche.citySelectionsResults` - Announcement for search results count
- `Recherche.selectDepartement` - Department selection announcement

**New Keys Needed**: None (reuse existing keys)

## Performance Considerations

### Debounce Timing
- **Current**: 500ms debounce on input
- **Finding**: Appropriate for dual API calls (allows both to complete)
- **Action**: Maintain existing debounce

### API Response Times
- **data.geopf.fr**: Typically 100-300ms
- **geo.api.gouv.fr**: Typically 50-150ms
- **Combined**: ~300-400ms (parallel calls)
- **Target**: < 1 second total (including debounce)

### Result Limiting
- **Current**: Limit to 5 results
- **Finding**: Reasonable for mobile UX
- **Action**: Maintain 5-result limit after merging both APIs

## Implementation Readiness

### ✓ Ready to Proceed
- API formats documented
- Merging strategy defined
- Edge cases identified
- No blocking issues found

### Data Flow Diagram

```
User Input
    ↓
[500ms Debounce]
    ↓
    ├─→ data.geopf.fr (municipality search)
    │   └─→ Transform to UnifiedSearchResult[]
    │
    └─→ geo.api.gouv.fr (department search)
        └─→ Transform to UnifiedSearchResult[]
    ↓
[Merge & Sort]
    ↓
[Limit to 5 results]
    ↓
[Display with visual distinction]
    ↓
[User selects result]
    ↓
[Extract department code]
    ↓
[Update Redux query.departments]
    ↓
[URL updated with department filter]
```

## Recommendations

1. **Error Handling**: Implement graceful degradation if one API fails (show results from the other)
2. **Caching**: Consider caching recent searches to reduce API calls
3. **Testing**: Create mock API responses for both endpoints for unit/integration tests
4. **Monitoring**: Log API response times to detect performance issues
5. **Accessibility**: Ensure screen reader announcements work with merged results

## Next Steps

Proceed to Phase 1 (Design & Contracts) to define:
- Exact data structure for merged results
- Component prop changes
- Test scenarios
- Visual distinction implementation
