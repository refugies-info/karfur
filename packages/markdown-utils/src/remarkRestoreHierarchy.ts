/**
 * Remark plugin to restore nested hierarchy from flat markdown directives.
 *
 * When remark-directive parses markdown, container directives (:::name ... :::)
 * are sometimes left flat in the AST. This plugin detects stray ":::" closing
 * fences (parsed as paragraphs) and uses them as signals to nest the preceding
 * sibling into the ante-preceding container directive.
 *
 * Transformation: `[Parent, Child, :::]` → `[Parent(Child)]`
 *
 * Pipeline position:
 *    [Markdown] → [remark-parse] → [remark-directive] → [THIS PLUGIN] → [directive transformer]
 *
 * Transformation Example:
 *    [ Input: Flat AST ]              [ Output: Nested AST ]
 *    (from remark-directive)          (after remark-restore-hierarchy)
 *
 *    +------------------+             +------------------+
 *    | ContainerDirective|             | ContainerDirective|
 *    | (start of block)  |             | (start of block)  |
 *    +------------------+             |  +-------------+ |
 *    | Paragraph         |   =====>    |  | Paragraph   | |
 *    | (inside content)  |             |  | (moved in)  | |
 *    +------------------+             |  +-------------+ |
 *    | Paragraph ":::"   |             +------------------+
 *    | (stray fence)     |             (Stray fence removed)
 *    +------------------+
 *
 * IMPORTANT: Only CONTENT nodes (paragraphs, lists, etc.) are nested.
 * If the element before a fence is another directive, the fence is treated
 * as closing the preceding directive — NOT as nesting the directive inside another.
 * This prevents toggle from being nested inside good-to-know when they should be siblings.
 *
 * Uses manual recursive traversal (not unist-util-visit) for compatibility
 * with Jest, Metro bundler, and Next.js (avoids ESM-only dependency).
 *
 * @module @refugies-info/markdown-utils
 */

import type { Node, Parent } from "unist";
import { isClosingFenceParagraph } from "./helpers";

/**
 * Visitor function to check and fix container hierarchy within a parent node.
 */
function checkContainer(node: Node) {
  const container = node as Parent;
  if (!container.children || !Array.isArray(container.children)) return;

  // Restart scan after mutation to handle multi-level nesting
  let i = 0;
  while (i < container.children.length) {
    const child = container.children[i];

    if (isClosingFenceParagraph(child)) {
      const index = i;

      // Need at least 2 preceding elements: [Target, ElementToMove, Fence]
      if (index >= 2) {
        const target = container.children[index - 2];
        const elementToMove = container.children[index - 1];

        // Only nest if:
        // 1. Target is a containerDirective
        // 2. ElementToMove is NOT a directive (it's content like paragraph, list, etc.)
        // If ElementToMove is a directive, the fence is closing Target, not nesting
        if (
          target.type === "containerDirective" &&
          elementToMove.type !== "containerDirective" &&
          elementToMove.type !== "leafDirective"
        ) {
          const targetContainer = target as Parent;
          targetContainer.children = targetContainer.children || [];
          targetContainer.children.push(elementToMove);

          // Remove moved element and the fence
          container.children.splice(index - 1, 2);

          // Step back to catch chained closures
          i = Math.max(0, index - 2);
          continue;
        }
      }

      // Remove invalid/unused fence (closing fence for a directive)
      container.children.splice(i, 1);
      continue;
    }

    i++;
  }
}

/**
 * Remark plugin to restore nested hierarchy.
 *
 * @returns A unified transformer function.
 */
export function remarkRestoreHierarchy() {
  return (tree: Node) => {
    // Use simple recursive traversal instead of importing unist-util-visit
    // to avoid ESM-only dependency issues with Jest and Metro bundler
    function walkAndCheck(node: Node) {
      checkContainer(node);
      const parent = node as Parent;
      if (parent.children && Array.isArray(parent.children)) {
        for (const child of parent.children) {
          walkAndCheck(child);
        }
      }
    }
    walkAndCheck(tree);
  };
}
