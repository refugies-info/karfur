/**
 * Central exports for seed data used throughout the client application
 * This file provides a single entry point for all seed data utilities
 */

// Export from themes.ts
export { getThemeSeedIds, makeThemesList, seedThemes } from "./themes";
export type { ThemeDocument, ThemeSeedIds } from "./themes";

// Export from needs.ts
export { getNeedSeedIds, makeNeedsList, seedNeeds } from "./needs";
export type { NeedDocument, NeedSeedIds } from "./needs";

// Export from schemas.ts
export { DispositifSchema, ModelNames, NeedSchema, TestSchemas, ThemeSchema, registerTestSchemas } from "./schemas";

// Export from dispositifs.ts
export { seedDispositifs } from "./dispositifs";
