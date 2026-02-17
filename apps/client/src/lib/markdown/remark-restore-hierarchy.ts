import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

/**
 * Remark Plugin to restore nested hierarchy from flat markdown directives.
 *
 * It scans for "stray" `:::` closing fences (parsed as paragraphs in flat markdown)
 * and uses them as signals to nest the preceding sibling into the ante-preceding sibling.
 *
 * Transformation: `[Parent, Child, :::]` -> `[Parent(Child)]`
 *
 *
 * Pipeline Position:
 *    [Markdown] -> [remark-parse] -> [remark-directive] -> [THIS PLUGIN] -> [react-markdown]
 *                                         (Produces Flat AST)    (Restores Nesting)
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
 * @returns A unified transformer function.
 */
export function remarkRestoreHierarchy() {
  return (tree: Node) => {
    visit(tree, checkContainer);
  };
}

/**
 * Visitor function to check and fix container hierarchy.
 * It looks for ":::" paragraphs and mimics the closing behavior by moving
 * preceding siblings into the target container.
 *
 * IMPORTANT: Only content (paragraphs, lists, etc.) should be nested.
 * A new directive after a fence means the fence is closing the previous directive,
 * NOT nesting the new directive inside it.
 *
 * @param node - The node currently being visited
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
 * Checks if a node is a paragraph containing only ":::".
 * This occurs when remark-directive parses a closing fence strictly as text
 * because of indentation/whitespace mismatches.
 *
 * @param node - The AST node to check (usually a paragraph)
 * @returns true if the node is a text paragraph containing exactly ":::"
 */
function isClosingFenceParagraph(node: any): boolean {
  if (node.type !== "paragraph") return false;
  if (!node.children || node.children.length !== 1) return false;

  const text = node.children[0];
  if (text.type !== "text") return false;

  return text.value.trim() === ":::";
}
