/**
 * Converts RCO markdown content to an array of HTML blocks for rendering
 * with individual ContentFromHtml instances.
 *
 * Splitting at the MDAST level ensures each block gets its own ReadableText
 * in the TTS player reading list, enabling per-block highlighting and navigation.
 *
 * Pipeline:
 *   markdown → remark-parse → remark-gfm → remark-directive
 *     → remarkRestoreHierarchy → remarkDirectiveToHtml
 *     → SPLIT root.children into groups
 *     → each group → remark-rehype → rehype-stringify → HTML string
 *
 * Split boundaries (new block starts at):
 * - heading (h2, h3...) — groups heading + following paragraphs/lists
 * - containerDirective (toggle, important, good-to-know) — isolated block
 */

import { remarkRestoreHierarchy } from "@refugies-info/markdown-utils";
import type { Root, RootContent } from "mdast";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { remarkDirectiveToHtml } from "./remarkDirectiveToHtml";

/**
 * Splits MDAST root children into groups for individual rendering.
 *
 * Rules:
 * - A heading starts a new "content" group (heading + following paragraphs/lists)
 * - A containerDirective is always isolated in its own group
 * - Paragraphs, lists, etc. accumulate in the current group
 */
function splitMdastChildren(children: RootContent[]): RootContent[][] {
  const groups: RootContent[][] = [];
  let current: RootContent[] = [];

  const flush = () => {
    if (current.length > 0) {
      groups.push([...current]);
      current = [];
    }
  };

  for (const node of children) {
    if (node.type === "heading") {
      flush();
      current.push(node);
    } else if ((node as any).type === "containerDirective") {
      flush();
      groups.push([node]);
    } else {
      current.push(node);
    }
  }
  flush();
  return groups;
}

/**
 * Processes RCO markdown content into an array of HTML blocks.
 *
 * Each block is rendered by its own ContentFromHtml → its own ReadableText
 * → individual item in the TTS player reading list.
 *
 * @param markdown - Raw markdown string from the API (dispositif.markdown)
 * @returns Array of HTML strings, one per block
 *
 * @example
 * ```ts
 * const blocks = markdownToHtmlBlocks("## Title\n\nParagraph\n\n:::toggle{title=\"Details\"}\nContent\n:::");
 * // Returns: [
 * //   "<h2>Title</h2>\n<p>Paragraph</p>",
 * //   "<div data-toggle=\"true\" data-title=\"Details\"><p>Content</p></div>"
 * // ]
 * ```
 */
export function markdownToHtmlBlocks(markdown: string): string[] {
  // 1. Parse + transform: markdown → fully transformed MDAST
  const mdProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkRestoreHierarchy)
    .use(remarkDirectiveToHtml);

  const mdast = mdProcessor.runSync(mdProcessor.parse(markdown)) as Root;

  // 2. Split root.children into groups
  const groups = splitMdastChildren(mdast.children);

  // 3. Convert each group to HTML via remark-rehype + rehype-stringify
  const htmlProcessor = unified()
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeStringify, { allowDangerousHtml: false });

  return groups.map((nodes) => {
    const subTree: Root = { type: "root", children: nodes };
    return String(htmlProcessor.stringify(htmlProcessor.runSync(subTree)));
  });
}
