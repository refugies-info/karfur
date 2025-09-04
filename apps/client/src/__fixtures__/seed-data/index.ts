/**
 * Central exports for seed data used throughout the client application
 * This file provides a single entry point for all seed data utilities
 */

// Export from themes.ts
export { makeThemesList, makeThemesSeedIds } from "./themes";
export type { ThemesSeedIds } from "./themes";

// Export from needs.ts
export { makeNeedsList, makeNeedsSeedIds } from "./needs";
export type { NeedsSeedIds } from "./needs";

// Export from schemas.ts
export { DispositifSchema, ModelNames, NeedSchema, TestSchemas, ThemeSchema, registerTestSchemas } from "./schemas";

// Export from dispositifs.ts
export { seedDispositifs } from "./dispositifs";

// Re-export commonly used types and utilities
export type { NeedsSeedIds as NeedSeedIds } from "./needs";
export type { ThemesSeedIds as ThemeSeedIds } from "./themes";
