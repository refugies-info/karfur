# Migration Code Examples

These examples are tailored to your codebase structure and `API.ts`.

## 1. Setup (Foundation)

**`_app.tsx` wrapper**
```tsx
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute default cache
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
         {/* ... Providers ... */}
         <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
```

## 2. Server State (Data Fetching)

### Simple Entity: Themes
Replace `themes.saga.ts` and `themes.reducer.ts` with a hook.

**`hooks/useThemes.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import API from '~/utils/API';
import type { GetThemeResponse } from '@refugies-info/api-types';

export const useThemes = () => {
  return useQuery<GetThemeResponse[]>({
    queryKey: ['themes'], // Unique cache key
    queryFn: API.getThemes,
    staleTime: Infinity, // Themes almost never change, cache forever
  });
};
```

**Prefetching in `getStaticProps` (SSG/SSR)**
```typescript
import { QueryClient, dehydrate } from '@tanstack/react-query';
import API from '~/utils/API';

export const getStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ['themes'],
    queryFn: API.getThemes,
  });

  return {
    props: {
      // Dehydrate query cache to pass to client
      dehydratedState: dehydrate(queryClient),
      // ... translations ...
    },
  };
};
```

### Complex Entity: Dispositif
Handling parameters and conditional fetching.

**`hooks/useDispositif.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import API from '~/utils/API';
import { useLocale } from '~/hooks';

export const useDispositif = (id: string | undefined) => {
  const locale = useLocale();
  
  return useQuery({
    queryKey: ['dispositif', id, locale],
    queryFn: () => API.getDispositif(id!, locale!), // API.ts signature
    enabled: !!id && !!locale, // Only fetch if ID exists
  });
};
```

## 3. UI State (Client Only)

### TTS Store (Global UI state)
Replace `tts.reducer.ts`.

**`stores/useTtsStore.ts`**
```typescript
import { create } from 'zustand';

interface TtsState {
  isActive: boolean;
  showSpinner: boolean;
  toggle: () => void;
  setSpinner: (show: boolean) => void;
}

export const useTtsStore = create<TtsState>((set) => ({
  isActive: false,
  showSpinner: false,
  toggle: () => set((state) => ({ isActive: !state.isActive })),
  setSpinner: (show) => set({ showSpinner: show }),
}));
```

## 4. Component Migration Example

**`Banner.tsx` Refactoring**

**❌ BEFORE (Redux)**
```tsx
const Banner = (props: Props) => {
  // Complex selectors
  const selectTheme = useMemo(makeThemeSelector, []);
  const theme = useSelector((state: RootState) => selectTheme(state, props.themeId));
  const dispositif = useSelector(selectedDispositifSelector);
  
  // ...
};
```

**✅ AFTER (React Query)**
```tsx
import { useThemes } from '~/hooks/useThemes';
import { useDispositif } from '~/hooks/useDispositif';

const Banner = (props: Props) => {
  // 1. Get all themes from cache (instant)
  const { data: themes } = useThemes();
  
  // 2. Find specific theme (derived state)
  const theme = themes?.find(t => t._id === props.themeId);

  // 3. Get dispositif (if needed here, otherwise pass as prop)
  const { data: dispositif } = useDispositif(router.query.id as string);

  // ... rest of component is identical
  return (
      // ...
      // theme?.banner?.secure_url works exactly the same
  );
};
```

## 5. Mutation Example (Save/Update)

**`hooks/useSaveDispositif.ts`**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '~/utils/API';

export const useSaveDispositif = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => API.updateDispositif(id, data),
    onSuccess: (updatedDispositif) => {
      // 1. Update cache immediately
      queryClient.setQueryData(['dispositif', updatedDispositif._id], updatedDispositif);
      
      // 2. Refetch related lists if needed
      queryClient.invalidateQueries({ queryKey: ['dispositifs'] });
    },
  });
};
```
