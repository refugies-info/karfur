/**
 * Shared directive constants for remark markdown plugins.
 *
 * ⚠️  IMPORTANT: This is the SINGLE SOURCE OF TRUTH for directive names.
 * Adding or removing a directive here impacts BOTH the web client AND the mobile app.
 *
 * Workflow for adding a new directive:
 * 1. Add the directive name to VALID_DIRECTIVE_NAMES below
 * 2. Add the directive mapping to DIRECTIVE_HTML_MAPPING below
 * 3. Implement the React renderer in apps/client (directive-to-component.tsx)
 * 4. Implement the HTML renderer in apps/mobile (remarkDirectiveToHtml.ts)
 * 5. Add tests in this package
 *
 * @module @refugies-info/markdown-utils
 */

/**
 * Valid directive names that should be transformed by remark plugins.
 *
 * Only directives in this set will be processed. All other directive-like
 * syntax (e.g., `:00` from "9:00" time notations) will be converted to
 * plain text to prevent rendering errors.
 *
 * Current directives:
 * - `toggle` — Collapsible accordion (:::toggle{title="..."})
 * - `important` — Important callout box (:::important)
 * - `good-to-know` — Informational callout box (:::good-to-know)
 */
export const VALID_DIRECTIVE_NAMES = new Set(["toggle", "important", "good-to-know"]);

/**
 * Mapping from directive names to HTML data attributes.
 *
 * Used by the mobile app's remarkDirectiveToHtml plugin to transform
 * directives into `<div>` elements with data attributes that
 * ContentFromHtml can render as native components.
 *
 * The web client uses a different mapping (React components) defined
 * in apps/client/src/lib/markdown/directive-to-component.tsx.
 */
export const DIRECTIVE_HTML_MAPPING: Record<
  string,
  { hName: string; hProperties: Record<string, string> }
> = {
  toggle: {
    hName: "div",
    hProperties: { "data-toggle": "true" },
  },
  important: {
    hName: "div",
    hProperties: { "data-callout": "important" },
  },
  "good-to-know": {
    hName: "div",
    hProperties: { "data-callout": "info" },
  },
};
