# Data Model: Enhance Location Search UX

**Phase**: 1 (Design & Contracts)  
**Date**: 2025-10-28  
**Status**: Complete

## Data Structures

### 1. Unified Search Result

**Purpose**: Normalize results from both municipality and department APIs into a single format

```typescript
interface UnifiedSearchResult {
  // Display information
  label: string;                    // e.g., "Paris (75)" or "Rhône (dept)"
  displayName: string;              // e.g., "Paris" or "Rhône"
  
  // Department information (always present)
  deptCode: string;                 // e.g., "75", "69" (used for final filter)
  deptName: string;                 // e.g., "Île-de-France", "Rhône"
  
  // Source information
  type: 'city' | 'department';      // Distinguishes result type
  source: 'municipality' | 'department';  // API source
  
  // Optional metadata
  postalCode?: string;              // e.g., "75001" (only for cities)
  region?: string;                  // e.g., "Île-de-France" (from department API)
}
```

### 2. API Response Contracts

#### Municipality API Response

```typescript
interface MunicipalityApiResponse {
  features: MunicipalityFeature[];
}

interface MunicipalityFeature {
  properties: {
    label: string;                  // e.g., "Paris (75), Île-de-France"
    context: string;                // Format: "{postalCode}, {deptName}, {country}"
    name: string;                   // e.g., "Paris"
  };
  geometry: {
    coordinates: [number, number];  // [longitude, latitude]
  };
}
```

**Transformation to UnifiedSearchResult**:
```typescript
function transformMunicipalityResult(feature: MunicipalityFeature): UnifiedSearchResult {
  const contextParts = feature.properties.context.split(", ");
  const postalCode = contextParts[0];
  const deptName = contextParts[1];
  
  return {
    label: `${feature.properties.name} (${postalCode})`,
    displayName: feature.properties.name,
    deptCode: postalCode.substring(0, 2),  // Extract dept code from postal code
    deptName: deptName,
    type: 'city',
    source: 'municipality',
    postalCode: postalCode,
    region: contextParts[2] || undefined
  };
}
```

#### Department API Response

```typescript
interface DepartmentApiResponse extends Array<DepartmentItem> {}

interface DepartmentItem {
  code: string;                     // e.g., "69"
  nom: string;                      // e.g., "Rhône"
  codeRegion: string;               // e.g., "84"
  region: string;                   // e.g., "Auvergne-Rhône-Alpes"
}
```

**Transformation to UnifiedSearchResult**:
```typescript
function transformDepartmentResult(dept: DepartmentItem): UnifiedSearchResult {
  return {
    label: `${dept.nom} (dept)`,
    displayName: dept.nom,
    deptCode: dept.code,
    deptName: dept.nom,
    type: 'department',
    source: 'department',
    region: dept.region
  };
}
```

### 3. Search State

**Current State** (in LocationMenu component):
```typescript
const [locationSearch, setLocationSearch] = useState<string>("");
const [suggestions, setSuggestions] = useState<any[]>([]);
```

**Updated State** (with type safety):
```typescript
const [locationSearch, setLocationSearch] = useState<string>("");
const [suggestions, setSuggestions] = useState<UnifiedSearchResult[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

### 4. Component Props

**LocationMenu Props** (unchanged):
```typescript
interface LocationMenuProps {
  mobile?: boolean;
}
```

**SearchMenuItem Props** (unchanged):
```typescript
interface SearchMenuItemProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
```

## API Integration

### Search Function

```typescript
async function searchLocations(query: string): Promise<UnifiedSearchResult[]> {
  if (query.length <= 2) {
    return [];
  }

  try {
    // Parallel API calls
    const [municipalityResponse, departmentResponse] = await Promise.all([
      fetch(`https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(query)}&type=municipality`),
      fetch(`https://geo.api.gouv.fr/departements?nom=${encodeURIComponent(query)}`)
    ]);

    if (!municipalityResponse.ok || !departmentResponse.ok) {
      throw new Error('API request failed');
    }

    const municipalityData: MunicipalityApiResponse = await municipalityResponse.json();
    const departmentData: DepartmentApiResponse = await departmentResponse.json();

    // Transform results
    const municipalityResults = (municipalityData.features || [])
      .map(transformMunicipalityResult);
    
    const departmentResults = (departmentData || [])
      .map(transformDepartmentResult);

    // Merge and sort
    const allResults = [...municipalityResults, ...departmentResults];
    const sortedResults = sortByRelevance(allResults, query);
    
    // Limit to 5 results
    return sortedResults.slice(0, 5);
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
}
```

### Sorting Strategy

```typescript
function sortByRelevance(results: UnifiedSearchResult[], query: string): UnifiedSearchResult[] {
  return results.sort((a, b) => {
    // Priority 1: Exact matches (case-insensitive)
    const aExact = a.displayName.toLowerCase() === query.toLowerCase();
    const bExact = b.displayName.toLowerCase() === query.toLowerCase();
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    // Priority 2: Starts with query
    const aStarts = a.displayName.toLowerCase().startsWith(query.toLowerCase());
    const bStarts = b.displayName.toLowerCase().startsWith(query.toLowerCase());
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    // Priority 3: Cities before departments
    if (a.type === 'city' && b.type === 'department') return -1;
    if (a.type === 'department' && b.type === 'city') return 1;

    // Priority 4: Alphabetical
    return a.displayName.localeCompare(b.displayName);
  });
}
```

## UI Rendering

### Result Display

**Current Implementation** (uses RadioButtons):
```tsx
<RadioButtons
  name="radio"
  legend="Résultats de recherche"
  className="[&_legend]:sr-only"
  options={suggestions.slice(0, 5).map((p, i) => {
    const placeName = getPlaceName(p);
    const deptNo = p.properties.context.split(",")[0];
    const isChecked = p.properties.context.includes(query.departments[0]);

    return {
      label: `${placeName} ${deptNo}`,
      nativeInputProps: {
        checked: isChecked,
        onChange: () => onSelectPrediction(p),
      },
    };
  })}
/>
```

**Updated Implementation** (with type distinction):
```tsx
<RadioButtons
  name="radio"
  legend="Résultats de recherche"
  className="[&_legend]:sr-only"
  options={suggestions.map((result) => {
    const isChecked = result.deptCode === query.departments[0];
    const typeLabel = result.type === 'city' ? '' : ' (Département)';

    return {
      label: `${result.displayName} (${result.deptCode})${typeLabel}`,
      nativeInputProps: {
        checked: isChecked,
        onChange: () => onSelectResult(result),
      },
    };
  })}
/>
```

### Visual Distinction Options

**Option A: Text Labels** (recommended)
- City: "Paris (75)"
- Department: "Rhône (69) (Département)"

**Option B: CSS Classes**
```css
.result-city {
  /* City styling */
}

.result-department {
  /* Department styling - e.g., different color or icon */
}
```

**Option C: Icons**
- City: 🏙️ "Paris (75)"
- Department: 🗺️ "Rhône (69)"

**Recommendation**: Use Option A (text labels) for clarity and accessibility.

## Redux Integration

**Current Behavior** (unchanged):
```typescript
dispatch(
  addToQueryActionCreator({
    departments: [depName],  // Department name (e.g., "Île-de-France")
    sort: "location",
  })
);
```

**No Changes Required**: The Redux integration remains the same. The `deptName` from UnifiedSearchResult maps directly to the `departments` array.

## Error Handling

### Scenarios

1. **Both APIs fail**: Show "Unable to search locations. Please try again."
2. **One API fails**: Show results from the other API
3. **No results**: Show "No locations found. Try a different search."
4. **Network timeout**: Show "Search timed out. Please try again."

### Implementation

```typescript
async function searchLocations(query: string): Promise<UnifiedSearchResult[]> {
  if (query.length <= 2) return [];

  try {
    const [municipalityResponse, departmentResponse] = await Promise.allSettled([
      fetch(`https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(query)}&type=municipality`),
      fetch(`https://geo.api.gouv.fr/departements?nom=${encodeURIComponent(query)}`)
    ]);

    let municipalityResults: UnifiedSearchResult[] = [];
    let departmentResults: UnifiedSearchResult[] = [];

    if (municipalityResponse.status === 'fulfilled' && municipalityResponse.value.ok) {
      const data = await municipalityResponse.value.json();
      municipalityResults = (data.features || []).map(transformMunicipalityResult);
    }

    if (departmentResponse.status === 'fulfilled' && departmentResponse.value.ok) {
      const data = await departmentResponse.value.json();
      departmentResults = (data || []).map(transformDepartmentResult);
    }

    if (municipalityResults.length === 0 && departmentResults.length === 0) {
      setError('No locations found');
      return [];
    }

    const allResults = [...municipalityResults, ...departmentResults];
    return sortByRelevance(allResults, query).slice(0, 5);
  } catch (error) {
    setError('Search failed. Please try again.');
    return [];
  }
}
```

## Testing Scenarios

### Unit Tests

1. **Transform Functions**
   - Transform municipality feature correctly
   - Transform department item correctly
   - Handle missing optional fields

2. **Sorting**
   - Exact matches appear first
   - Prefix matches appear before fuzzy matches
   - Cities appear before departments (same relevance)
   - Alphabetical sorting as tiebreaker

3. **Merging**
   - Combine results from both APIs
   - Limit to 5 results
   - Handle empty results from one API

### Integration Tests

1. **Search Flow**
   - Type "par" → See "Paris (75)" and "Pas-de-Calais (62)"
   - Type "rhone" → See "Rennes (35)" and "Rhône (69) (Département)"
   - Type "xyz" → See "No results found"

2. **Selection**
   - Select city → Redux updated with department name
   - Select department → Redux updated with department name
   - URL updated with department filter

3. **Edge Cases**
   - Special characters: "Côte-d'Or"
   - Accents: "Île-de-France"
   - Short queries: "Pa" (should not trigger search)

### E2E Tests (Playwright)

1. Load search page
2. Click location filter
3. Type "paris"
4. Verify both city and department results appear
5. Select "Paris (75)"
6. Verify URL contains department filter
7. Verify results filtered by department

## Accessibility Considerations

### Screen Reader Announcements

**Current**: `Recherche.citySelectionsResults` with result count

**Updated**: Maintain same announcement, but include result type in label:
- "Paris (75)" → Announced as "Paris 75"
- "Rhône (69) (Département)" → Announced as "Rhône 69 Département"

### Keyboard Navigation

- Tab through results
- Enter/Space to select
- Escape to close dropdown (existing behavior)

### ARIA Labels

```tsx
<RadioButtons
  legend="Résultats de recherche"
  className="[&_legend]:sr-only"  // Hidden from sighted users
  options={suggestions.map((result) => ({
    label: `${result.displayName} (${result.deptCode})${result.type === 'department' ? ' (Département)' : ''}`,
    // ...
  }))}
/>
```

## Performance Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| API response time | < 400ms | Parallel calls to both APIs |
| Debounce delay | 500ms | Existing behavior |
| Total search time | < 1s | Including debounce + API calls |
| Result rendering | < 100ms | DOM update for 5 results |
| Memory usage | < 1MB | Suggestions array + state |

## Next Steps

1. Implement data transformation functions
2. Update LocationMenu component with dual API calls
3. Add error handling and loading states
4. Create unit tests for transformations and sorting
5. Create integration tests for search flow
6. Update E2E tests for new result types
