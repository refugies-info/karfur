# Quickstart: Enhance Location Search UX

**Phase**: 1 (Design & Contracts)  
**Date**: 2025-10-28  
**Status**: Complete

## Quick Overview

This feature enhances the location search in the recherche (search) page by:
1. Changing the default filter label from "Département" to "Ville"
2. Searching both cities AND departments (dual API approach)
3. Merging results into a single auto-suggest list
4. Maintaining department code in URL for backward compatibility

## Key Files to Modify

```
apps/client/src/
├── components/Pages/recherche/
│   ├── SearchHeader/Filters.tsx          # Line 120: Change default label
│   └── LocationMenu/
│       ├── LocationMenu.tsx              # Main search logic
│       ├── functions.ts                  # Add helper functions
│       └── LocationMenu.module.css       # Add styles for distinction
└── pages/recherche.tsx                   # (No changes needed)
```

## Implementation Checklist

### Task 1: Update Default Label (Quick Win)
**File**: `Filters.tsx` (line 120)

**Current**:
```typescript
const locationLabel = useMemo(() => {
  return query.departments.length === 0
    ? t("Recherche.filterLocation", "Département")
    : ...
}, [t, query.departments, departmentsNotDeployed, isTablet]);
```

**Change To**:
```typescript
const locationLabel = useMemo(() => {
  return query.departments.length === 0
    ? t("Recherche.filterLocation", "Ville")  // Changed from "Département"
    : ...
}, [t, query.departments, departmentsNotDeployed, isTablet]);
```

**Effort**: 1 line change | **Time**: 5 minutes

---

### Task 2: Add Helper Functions
**File**: `LocationMenu/functions.ts`

**Add**:
```typescript
// Type definitions
export interface UnifiedSearchResult {
  label: string;
  displayName: string;
  deptCode: string;
  deptName: string;
  type: 'city' | 'department';
  source: 'municipality' | 'department';
  postalCode?: string;
  region?: string;
}

// Transform municipality API response
export function transformMunicipalityResult(feature: any): UnifiedSearchResult {
  const contextParts = feature.properties.context.split(", ");
  const postalCode = contextParts[0];
  const deptName = contextParts[1];
  
  return {
    label: `${feature.properties.name} (${postalCode})`,
    displayName: feature.properties.name,
    deptCode: postalCode.substring(0, 2),
    deptName: deptName,
    type: 'city',
    source: 'municipality',
    postalCode: postalCode,
    region: contextParts[2] || undefined
  };
}

// Transform department API response
export function transformDepartmentResult(dept: any): UnifiedSearchResult {
  return {
    label: `${dept.nom} (${dept.code})`,
    displayName: dept.nom,
    deptCode: dept.code,
    deptName: dept.nom,
    type: 'department',
    source: 'department',
    region: dept.region
  };
}

// Sort results by relevance
export function sortByRelevance(results: UnifiedSearchResult[], query: string): UnifiedSearchResult[] {
  return results.sort((a, b) => {
    const aExact = a.displayName.toLowerCase() === query.toLowerCase();
    const bExact = b.displayName.toLowerCase() === query.toLowerCase();
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStarts = a.displayName.toLowerCase().startsWith(query.toLowerCase());
    const bStarts = b.displayName.toLowerCase().startsWith(query.toLowerCase());
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    if (a.type === 'city' && b.type === 'department') return -1;
    if (a.type === 'department' && b.type === 'city') return 1;

    return a.displayName.localeCompare(b.displayName);
  });
}
```

**Effort**: ~50 lines | **Time**: 20 minutes

---

### Task 3: Update LocationMenu Component
**File**: `LocationMenu/LocationMenu.tsx`

**Changes**:

1. **Import new helpers** (top of file):
```typescript
import { 
  transformMunicipalityResult, 
  transformDepartmentResult, 
  sortByRelevance,
  UnifiedSearchResult 
} from "./functions";
```

2. **Update state** (line ~44):
```typescript
const [suggestions, setSuggestions] = useState<UnifiedSearchResult[]>([]);
```

3. **Replace onChangeDepartmentInput** (line ~56):
```typescript
const onChangeDepartmentInput = useCallback(
  (e: any) => {
    const search = e.target.value;
    setLocationSearch(search);
    if (search.length > 2) {
      // Parallel API calls
      Promise.all([
        fetch(`https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(search)}&type=municipality`)
          .then((response) => response.json())
          .catch(() => ({ features: [] })),
        fetch(`https://geo.api.gouv.fr/departements?nom=${encodeURIComponent(search)}`)
          .then((response) => response.json())
          .catch(() => [])
      ]).then(([municipalityData, departmentData]) => {
        const municipalityResults = (municipalityData.features || [])
          .map(transformMunicipalityResult);
        const departmentResults = (departmentData || [])
          .map(transformDepartmentResult);
        
        const allResults = [...municipalityResults, ...departmentResults];
        const sortedResults = sortByRelevance(allResults, search);
        const limitedResults = sortedResults.slice(0, 5);
        
        setSuggestions(limitedResults);
        announce(
          t("Recherche.citySelectionsResults", {
            count: limitedResults.length,
          }),
          { delay: 1000, priority: "interrupt" },
        );
      });
    } else {
      announce(
        t("Recherche.citySelectionsResults", {
          count: 0,
        }),
        { delay: 1000, priority: "interrupt" },
      );
      setSuggestions([]);
    }
  },
  [setLocationSearch, announce, t],
);
```

4. **Update onSelectPrediction** (line ~95):
```typescript
const onSelectPrediction = useCallback(
  (result: UnifiedSearchResult) => {
    Event(eventName, "choose location option", result.label);
    Event(eventName, "click filter", "location");

    setPreviousResultsCount(filteredResults.matches.length);
    setPendingAnnounce(true);

    dispatch(
      addToQueryActionCreator({
        departments: [result.deptName],
        sort: "location",
      }),
    );
  },
  [dispatch, eventName, filteredResults.matches.length],
);
```

5. **Update RadioButtons rendering** (line ~176):
```tsx
<RadioButtons
  name="radio"
  legend="Résultats de recherche"
  className="[&_legend]:sr-only"
  options={suggestions.map((result) => {
    const isChecked = result.deptCode === query.departments[0]?.substring(0, 2);
    const typeLabel = result.type === 'department' ? ' (Département)' : '';

    return {
      label: `${result.displayName} (${result.deptCode})${typeLabel}`,
      nativeInputProps: {
        checked: isChecked,
        onChange: () => onSelectPrediction(result),
      },
    };
  })}
/>
```

**Effort**: ~80 lines modified | **Time**: 45 minutes

---

### Task 4: Add Styling (Optional)
**File**: `LocationMenu/LocationMenu.module.css`

**Add** (if visual distinction needed):
```css
.departmentResult {
  font-style: italic;
  opacity: 0.8;
}

.cityResult {
  font-weight: 500;
}
```

**Effort**: ~5 lines | **Time**: 5 minutes

---

### Task 5: Update Tests
**Files**: Test files for LocationMenu

**Add test cases**:
- ✓ Search returns both cities and departments
- ✓ Results are sorted by relevance
- ✓ Results limited to 5 items
- ✓ Department code extracted correctly
- ✓ Selection updates Redux with department name
- ✓ Special characters handled correctly
- ✓ Empty results handled gracefully

**Effort**: ~100 lines | **Time**: 60 minutes

---

### Task 6: E2E Testing
**File**: Playwright test for recherche page

**Test scenarios**:
1. Load search page
2. Click location filter
3. Type "paris" → See "Paris (75)" and potentially "Pas-de-Calais"
4. Select "Paris (75)" → URL updated with department
5. Type "rhone" → See "Rennes" and "Rhône (Département)"
6. Select "Rhône" → URL updated with department

**Effort**: ~50 lines | **Time**: 30 minutes

---

## Development Workflow

### Step 1: Setup
```bash
git checkout 001-enhance-location-search
cd apps/client
```

### Step 2: Implement Changes
1. Update `Filters.tsx` (5 min)
2. Create/update `LocationMenu/functions.ts` (20 min)
3. Update `LocationMenu/LocationMenu.tsx` (45 min)
4. Add styling if needed (5 min)

### Step 3: Test Locally
```bash
npm run dev
# Navigate to /recherche
# Test location search with various inputs
```

### Step 4: Run Tests
```bash
npm run test -- LocationMenu
npm run test:e2e -- recherche
```

### Step 5: Verify Accessibility
- Test with screen reader (VoiceOver/NVDA)
- Verify keyboard navigation
- Check ARIA labels

### Step 6: Performance Check
- Monitor API response times
- Verify debounce behavior
- Check for memory leaks

## Estimated Timeline

| Task | Time | Priority |
|------|------|----------|
| Task 1: Update label | 5 min | P1 |
| Task 2: Helper functions | 20 min | P1 |
| Task 3: Component update | 45 min | P1 |
| Task 4: Styling | 5 min | P2 |
| Task 5: Unit tests | 60 min | P1 |
| Task 6: E2E tests | 30 min | P1 |
| **Total** | **165 min** | |

**Estimated effort**: ~2.5-3 hours for complete implementation + testing

## Common Pitfalls

1. **Forgetting to encode search query**: Use `encodeURIComponent(search)` for both APIs
2. **Not handling API errors**: Use `Promise.allSettled()` instead of `Promise.all()`
3. **Incorrect department code extraction**: Postal code first 2 digits = dept code (e.g., "75001" → "75")
4. **Not limiting results**: Remember to slice to 5 results after merging
5. **Breaking existing behavior**: Maintain Redux integration and URL updates

## Rollback Plan

If issues arise:
1. Revert to previous commit: `git revert <commit-hash>`
2. Restore original `onChangeDepartmentInput` logic
3. Restore original `Filters.tsx` label
4. Test with existing functionality

## Success Criteria

- ✓ Default label shows "Ville" instead of "Département"
- ✓ Search returns both cities and departments
- ✓ Results are merged and limited to 5 items
- ✓ Visual distinction between city and department results
- ✓ Department code stored in URL (backward compatible)
- ✓ All existing tests pass
- ✓ New tests pass
- ✓ Accessibility maintained (RGAA 4)
- ✓ Performance: < 1 second total search time
