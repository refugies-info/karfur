/**
 * Remark plugin that transforms markdown directives into HTML elements
 * compatible with mobile's ContentFromHtml renderer.
 *
 * This is the mobile equivalent of the web client's `remarkDirectiveToComponent.tsx`.
 * Instead of creating React components (via data.hName), we transform directives
 * into HTML elements with data attributes that ContentFromHtml already handles:
 * - `:::important` → `<div data-callout="important">` (handled at ContentFromHtml.tsx:169)
 * - `:::good-to-know` → `<div data-callout="info">` (handled at ContentFromHtml.tsx:198)
 * - `:::toggle{title="X"}` → `<div data-toggle="true" data-title="X">` (custom renderer)
 *
 * Invalid directives (like `:00` from "9:00" time notations) are converted to
 * plain text to prevent rendering errors, same as the web client.
 *
 * Directive constants and helpers imported from @refugies-info/markdown-utils (single source of truth).
 */
import {
  DIRECTIVE_HTML_MAPPING,
  isValidDirectiveName,
  reconstructDirectiveText,
} from "@refugies-info/markdown-utils";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

/**
 * Recursively serialize MDAST children to a basic HTML string.
 * Stored as data-html-content attribute on toggle divs so that
 * ContentFromHtml can pass it to AccordionAnimated's content prop.
 * This ensures toggles use the same rendering pipeline as RI accordions
 * (content string → ContentFromHtml → ReadableText → TTS player).
 */
/**
 * Manual MDAST-to-HTML serializer (intentionally not using remark-rehype/rehype-stringify).
 *
 * Why manual? remark-rehype and rehype-stringify are pure ESM modules, incompatible
 * with Metro bundler (React Native) without heavy configuration. This covers the node
 * types actually produced by Content Playground markdown (paragraphs, lists, links,
 * bold, italic, headings). Unsupported nodes degrade gracefully by serializing their
 * children — no crash, just plain text fallback.
 */
function serializeChildrenToHtml(node: any): string {
  if (!node.children) return "";
  return node.children.map((child: any) => serializeNodeToHtml(child)).join("");
}

function serializeNodeToHtml(node: any): string {
  if (node.type === "text") return node.value || "";
  if (node.type === "paragraph") return `<p>${serializeChildrenToHtml(node)}</p>`;
  if (node.type === "strong") return `<strong>${serializeChildrenToHtml(node)}</strong>`;
  if (node.type === "emphasis") return `<em>${serializeChildrenToHtml(node)}</em>`;
  if (node.type === "link")
    return `<a href="${node.url || ""}">${serializeChildrenToHtml(node)}</a>`;
  if (node.type === "list") {
    const tag = node.ordered ? "ol" : "ul";
    return `<${tag}>${serializeChildrenToHtml(node)}</${tag}>`;
  }
  if (node.type === "listItem") return `<li>${serializeChildrenToHtml(node)}</li>`;
  if (node.type === "heading")
    return `<h${node.depth}>${serializeChildrenToHtml(node)}</h${node.depth}>`;
  // Fallback: serialize children
  if (node.children) return serializeChildrenToHtml(node);
  return "";
}

/**
 * Remark plugin: transforms directives to HTML elements for mobile rendering.
 */
export function remarkDirectiveToHtml() {
  return (tree: Root) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        if (isValidDirectiveName(node.name)) {
          const mapping = DIRECTIVE_HTML_MAPPING[node.name];
          if (mapping) {
            const data = node.data || (node.data = {});
            data.hName = mapping.hName;

            // Build hProperties: merge mapping properties with directive attributes
            const properties = { ...mapping.hProperties };

            // For toggle, pass the title as data-title
            if (node.name === "toggle" && node.attributes?.title) {
              properties["data-title"] = node.attributes.title;
            }
            // For toggle, pass stepNumber if present
            if (node.name === "toggle" && node.attributes?.stepNumber) {
              properties["data-step-number"] = node.attributes.stepNumber;
            }
            // For toggle, serialize children as HTML for AccordionAnimated's content prop
            if (node.name === "toggle") {
              properties["data-html-content"] = serializeChildrenToHtml(node);
            }

            data.hProperties = properties;
          }
        } else if (node.type === "textDirective" && parent && typeof index === "number") {
          // Invalid text directive (e.g., :00 from "9:00") → convert to plain text
          parent.children[index] = {
            type: "text",
            value: reconstructDirectiveText(node),
          };
        }
        // Container/leaf directives with invalid names are left as-is
        // (they'll be filtered out during HTML serialization)
      }
    });
  };
}
