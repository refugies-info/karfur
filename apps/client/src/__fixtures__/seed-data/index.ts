/**
 * Central exports for seed data used throughout the client application
 * This file provides a single entry point for all seed data utilities
 */

// Export from types.ts
export type { NeedDocument, NeedSeedIds, ThemeDocument, ThemeSeedIds } from "./types";

// Export from themes.ts
export { getThemeSeedIds, makeThemesList, seedThemes } from "./themes";

// Export from needs.ts
export { getNeedSeedIds, makeNeedsList, seedNeeds } from "./needs";

// Export from schemas.ts
export { DispositifSchema, ModelNames, NeedSchema, TestSchemas, ThemeSchema, registerTestSchemas } from "./schemas";

// Export from dispositifs.ts
export { seedDispositifs } from "./dispositifs";
