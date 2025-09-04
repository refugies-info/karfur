/**
 * Central exports for seed data used throughout the client application
 * This file provides a single entry point for all seed data utilities
 */

// Export from themes.ts
export { makeThemesSeedIds, makeThemesList } from "./themes";
export type { ThemesSeedIds } from "./themes";

// Export from needs.ts
export { makeNeedsSeedIds, makeNeedsList } from "./needs";
export type { NeedsSeedIds } from "./needs";

// Export from schemas.ts
export {
  ThemeSchema,
  NeedSchema,
  DispositifSchema,
  TestSchemas,
  ModelNames,
  registerTestSchemas,
} from "./schemas";

// Export from dispositifs.ts
export { seedDispositifs } from "./dispositifs";
export type { SeedIds } from "./dispositifs";

// Re-export commonly used types and utilities
export type { ThemesSeedIds as ThemeSeedIds } from "./themes";
export type { NeedsSeedIds as NeedSeedIds } from "./needs";

// Centralized type for combined seed IDs (used across multiple files)
export type { SeedIds as CombinedSeedIds } from "./dispositifs";
