/**
 * Shared helper functions for remark directive plugins.
 *
 * These functions are used by both the web client (directive-to-component.tsx)
 * and the mobile app (remarkDirectiveToHtml.ts) to handle directive validation
 * and text reconstruction.
 *
 * @module @refugies-info/markdown-utils
 */

import { VALID_DIRECTIVE_NAMES } from "./constants";

/**
 * Checks if a directive name is valid for transformation.
 *
 * A valid directive must:
 * 1. Be in the VALID_DIRECTIVE_NAMES whitelist
 * 2. Start with a letter (HTML tag names cannot start with numbers)
 *
 * @example
 * isValidDirectiveName("toggle")    // true
 * isValidDirectiveName("00")        // false (from "9:00" time notation)
 * isValidDirectiveName("unknown")   // false (not in whitelist)
 */
export function isValidDirectiveName(name: string): boolean {
  if (!VALID_DIRECTIVE_NAMES.has(name)) return false;
  if (!/^[a-zA-Z]/.test(name)) return false;
  return true;
}

/**
 * Returns the markdown prefix for a directive type.
 *
 * @example
 * getDirectivePrefix("textDirective")      // ":"
 * getDirectivePrefix("leafDirective")      // "::"
 * getDirectivePrefix("containerDirective") // ":::"
 */
export function getDirectivePrefix(type: string): string {
  if (type === "textDirective") return ":";
  if (type === "leafDirective") return "::";
  return ":::";
}

/**
 * Reconstructs the original text representation of a directive.
 *
 * Used for invalid directives that should be rendered as plain text
 * instead of being transformed into components/HTML elements.
 *
 * @example
 * // textDirective with name="00" → ":00"
 * // leafDirective with name="foo" → "::foo"
 * // containerDirective with name="bar" attrs={title:"X"} → ':::bar{title="X"}'
 */
export function reconstructDirectiveText(node: any): string {
  const prefix = getDirectivePrefix(node.type);
  let text = prefix + node.name;

  if (node.attributes && Object.keys(node.attributes).length > 0) {
    const attrs = Object.entries(node.attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
    text += `{${attrs}}`;
  }

  return text;
}

/**
 * Checks if a node is a paragraph containing only ":::".
 *
 * This occurs when remark-directive parses a closing fence strictly as text
 * because of indentation/whitespace mismatches. The remarkRestoreHierarchy
 * plugin uses this to detect closing fences and restore proper nesting.
 *
 * @param node - The AST node to check (usually a paragraph)
 * @returns true if the node is a text paragraph containing exactly ":::"
 */
export function isClosingFenceParagraph(node: any): boolean {
  if (node.type !== "paragraph") return false;
  if (!node.children || node.children.length !== 1) return false;
  const text = node.children[0];
  if (text.type !== "text") return false;
  return text.value.trim() === ":::";
}
