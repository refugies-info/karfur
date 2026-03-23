/**
 * @refugies-info/markdown-utils
 *
 * Shared remark markdown plugins and directive utilities for the
 * web client (apps/client) and mobile app (apps/mobile).
 *
 * This package is the SINGLE SOURCE OF TRUTH for:
 * - Directive whitelist (VALID_DIRECTIVE_NAMES)
 * - Directive helpers (validation, prefix, text reconstruction)
 * - remarkRestoreHierarchy plugin (AST nesting fix)
 *
 * Platform-specific rendering stays in each app:
 * - Web: apps/client/src/lib/markdown/directive-to-component.tsx (React components)
 * - Mobile: apps/mobile/src/libs/markdown/remarkDirectiveToHtml.ts (HTML data-attributes)
 */

// Constants
export { DIRECTIVE_HTML_MAPPING, VALID_DIRECTIVE_NAMES } from "./constants";

// Helpers
export {
  getDirectivePrefix,
  isClosingFenceParagraph,
  isValidDirectiveName,
  reconstructDirectiveText,
} from "./helpers";

// Plugins
export { remarkRestoreHierarchy } from "./remarkRestoreHierarchy";
