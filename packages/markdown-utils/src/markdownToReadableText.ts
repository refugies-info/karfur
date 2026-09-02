/**
 * Markdown to plain readable text, for text-to-speech restitution.
 *
 * RCO dispositifs store their body as markdown (`dispositif.markdown`) while RI
 * dispositifs store HTML. The web client vocalises HTML with `html2plaintext`;
 * feeding it raw markdown would make Azure read out the `#`, the `**` and the
 * `:::toggle` fences. This module is the markdown counterpart.
 *
 * Dependency-free on purpose: `remark-parse` and `mdast-util-to-string` are
 * ESM-only, which this package avoids so it stays usable from Jest and the
 * Metro bundler. See the note in `remarkRestoreHierarchy.ts`.
 *
 * @module @refugies-info/markdown-utils
 */

import { isValidDirectiveName } from "./helpers";

/** Opening container fence carrying a directive name: `:::toggle{title="…"}`. */
const CONTAINER_DIRECTIVE = /^:{3,}\s*([A-Za-z][A-Za-z0-9-]*)\s*(\{.*\})?\s*$/;

/** Leaf directive alone on its line: `::name{…}`. */
const LEAF_DIRECTIVE = /^::\s*([A-Za-z][A-Za-z0-9-]*)\s*(\{.*\})?\s*$/;

/** Bare closing fence, with no directive name. */
const CLOSING_FENCE = /^:{3,}\s*$/;

/** The `title="…"` attribute a `toggle` directive carries. */
const TITLE_ATTRIBUTE = /title\s*=\s*"([^"]*)"/;

/** Opening or closing fence of a code block. */
const CODE_FENCE = /^\s*(?:`{3,}|~{3,})/;

/** Thematic break: `---`, `***`, `___`. */
const THEMATIC_BREAK = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;

/** Any row of a GFM table. */
const TABLE_ROW = /^\s*\|.*\|\s*$/;

/** Alignment row of a GFM table: `|---|:--:|`. */
const TABLE_DELIMITER = /^\s*\|[\s:|-]*\|\s*$/;

/** Leading marker of a bullet or ordered list item. */
const LIST_MARKER = /^\s*(?:[-*+]|\d+[.)])\s+/;

/** Leading `>` of a blockquote, possibly repeated. */
const QUOTE_MARKER = /^\s*(?:>\s?)+/;

/** Leading `#` of an ATX heading. */
const HEADING_MARKER = /^\s*#{1,6}\s+/;

/** Sentence-final punctuation, including the Arabic full stop and question mark. */
const ENDS_A_SENTENCE = /[.!?;:،۔؟]$/;

/**
 * Strips the inline markdown syntax of a single line.
 *
 * Images keep their alt text, which is the accessible description of the
 * picture. Links keep their label and drop the URL, which nobody wants read
 * out loud character by character.
 */
function stripInlineSyntax(line: string): string {
  return (
    line
      // Images before links: `![alt](src)` also matches the link pattern.
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
      // Autolinks: `<https://…>` and `<contact@example.org>`.
      .replace(/<[^>\s]+@[^>\s]+>/g, "")
      .replace(/<https?:\/\/[^>\s]*>/g, "")
      // Inline code keeps its content, the backticks go.
      .replace(/`+([^`]*)`+/g, "$1")
      .replace(/~~([\s\S]*?)~~/g, "$1")
      .replace(/(\*{1,3})(\S(?:[\s\S]*?\S)?)\1/g, "$2")
      // Underscore emphasis only around word boundaries, so snake_case survives.
      .replace(/(^|[\s(])(_{1,3})(\S(?:[\s\S]*?\S)?)\2(?=[\s).,;:!?]|$)/g, "$1$3")
      // Raw HTML is legal in GFM and would be read out as tag names.
      .replace(/<\/?[A-Za-z][^>]*>/g, "")
      .replace(/\\([\\`*_{}[\]()#+\-.!|~>])/g, "$1")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Turns one line into the text to read, or an empty string when the line
 * carries no readable content (fences, separators, thematic breaks).
 */
function lineToText(line: string): string {
  if (CLOSING_FENCE.test(line)) return "";
  if (THEMATIC_BREAK.test(line)) return "";
  if (TABLE_DELIMITER.test(line)) return "";

  const container = line.match(CONTAINER_DIRECTIVE);
  if (container && isValidDirectiveName(container[1])) {
    // A `toggle` is an accordion: its title is the only readable part of the
    // fence, and it introduces the content that follows. Callouts carry none.
    const title = container[2]?.match(TITLE_ATTRIBUTE)?.[1];
    return title ? stripInlineSyntax(title) : "";
  }

  const leaf = line.match(LEAF_DIRECTIVE);
  if (leaf && isValidDirectiveName(leaf[1])) return "";

  if (TABLE_ROW.test(line)) {
    return line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => stripInlineSyntax(cell))
      .filter(Boolean)
      .join(". ");
  }

  const stripped = line
    .replace(QUOTE_MARKER, "")
    .replace(HEADING_MARKER, "")
    .replace(LIST_MARKER, "");

  return stripInlineSyntax(stripped);
}

/**
 * Converts a markdown document into a single plain-text string suitable for
 * text-to-speech.
 *
 * Blocks are joined with a full stop so the speech engine pauses between them
 * instead of running a heading into the paragraph below it.
 *
 * Directive-like text that is not a known directive is left untouched: `9:00`
 * stays `9:00`, matching the whitelist the renderers use.
 *
 * @example
 * markdownToReadableText("# Titre\n\nUn [lien](https://x.fr) utile.")
 * // "Titre. Un lien utile."
 *
 * @example
 * markdownToReadableText(':::toggle{title="Comment faire ?"}\nDemandez.\n:::')
 * // "Comment faire ?. Demandez."
 */
export function markdownToReadableText(markdown: string | null | undefined): string {
  if (!markdown) return "";

  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: string[] = [];
  let insideCodeBlock = false;

  for (const line of lines) {
    if (CODE_FENCE.test(line)) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }
    if (insideCodeBlock) continue;

    const text = lineToText(line);
    if (text) blocks.push(text);
  }

  return blocks
    .map((block, index) =>
      index === blocks.length - 1 || ENDS_A_SENTENCE.test(block) ? block : `${block}.`,
    )
    .join(" ")
    .trim();
}
