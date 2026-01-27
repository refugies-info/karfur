import { remarkRestoreHierarchy } from "@refugies-info/markdown-utils";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

/**
 * ============================================================================
 * MOBILE MARKDOWN PARSER - ARCHITECTURE
 * ============================================================================
 *
 * This module transforms Markdown content into HTML optimized for the mobile
 * application's renderer (react-native-render-html).
 *
 * PIPELINE FLOW:
 *
 * [ RAW MARKDOWN ]
 *       │
 *       ▼
 * [ remark-parse ] -> Parses Markdown text to AST (Abstract Syntax Tree)
 *       │
 *       ▼
 * [ remark-directive ] -> Parses custom directives like :::toggle, :::important
 *       │                 (Produces flat AST with orphaned ':::' fences)
 *       │
 *       ▼
 * [ remark-restore-hierarchy ] -> Shared Utility (@refugies-info/markdown-utils)
 *       │                         Nests content inside directives, fixing the AST.
 *       │
 *       ▼
 * [ remark-rehype-directive ] -> Mobile Specific Plugin (Defined below)
 *       │                        Maps directives to HTML attributes:
 *       │                        :::toggle -> <div data-component="toggle">
 *       │                        :::important -> <div data-callout="important">
 *       │                        :::good-to-know -> <div data-callout="info">
 *       │
 *       ▼
 * [ remark-rehype ] -> Transforms Markdown AST to HTML AST
 *       │
 *       ▼
 * [ rehype-stringify ] -> Serializes HTML AST to String
 *       │
 *       ▼
 * [ HTML STRING ]
 *
 * ============================================================================
 */

/**
 * Remark/Rehype Plugin: Directives to HTML Properties
 *
 * Transforms remark directives (`:::name`) into HTML attributes (`data-component`, etc.)
 * so they can be interpreted by `react-native-render-html` in the component layer.
 *
 * Mappings:
 * - `:::toggle` -> `<div data-component="toggle" data-title="..." data-step-number="...">`
 * - `:::important` -> `<div data-callout="important">`
 * - `:::good-to-know` -> `<div data-callout="info">`
 */
function remarkRehypeDirective() {
  return (tree: Node) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        // biome-ignore lint/suspicious/noExplicitAny: AST traversal uses loose types
        const dNode = node as any;
        const data = dNode.data || (dNode.data = {});
        const attributes = dNode.attributes || {};
        const name = dNode.name;

        // Configure HTML properties (hName, hProperties) for remark-rehype
        data.hName = "div"; // Map everything to div for simplicity
        data.hProperties = data.hProperties || {};

        if (name === "toggle") {
          data.hProperties["data-component"] = "toggle";
          if (attributes.title) data.hProperties["data-title"] = attributes.title;
          if (attributes.stepNumber) {
            data.hProperties["data-step-number"] = attributes.stepNumber;
          }
        } else if (name === "important") {
          data.hProperties["data-callout"] = "important";
        } else if (name === "good-to-know") {
          data.hProperties["data-callout"] = "info";
        } else {
          // Fallback for unknown directives
          data.hProperties.class = name;
        }
      }
    });
  };
}

/**
 * Parses markdown to HTML compatible with the Mobile Renderer.
 *
 * @param markdown - Raw markdown string to parse.
 * @returns Promise resolving to the generated HTML string.
 */
export const markdownToHtml = async (markdown: string): Promise<string> => {
  if (!markdown) return "";

  const file = await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkRestoreHierarchy) // Shared logic: Fix nested directives hierarchy
    .use(remarkRehypeDirective) // Mobile logic: Transform directives to HTML props
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
};
