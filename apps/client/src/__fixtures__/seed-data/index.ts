/**
 * Central exports for seed data used throughout the client application
 * This file provides a single entry point for all seed data utilities
 */

// Export from dispositifs.ts
export { seedDispositifs } from "./dispositifs";
// Export from needs.ts
export { getNeedSeedIds, makeNeedsList, seedNeeds } from "./needs";
// Export from schemas.ts
export {
  DispositifSchema,
  ModelNames,
  NeedSchema,
  registerTestSchemas,
  TestSchemas,
  ThemeSchema,
} from "./schemas";
// Export from themes.ts
export { getThemeSeedIds, makeThemesList, seedThemes } from "./themes";
// Export from types.ts
export type { NeedDocument, NeedSeedIds, ThemeDocument, ThemeSeedIds } from "./types";
