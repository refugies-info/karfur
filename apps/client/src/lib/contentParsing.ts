import { t } from "i18next";
import { sanitizeContent } from "~/lib/sanitizeContent";

export const getCalloutTranslationKey = (level: "info" | "important") => {
  switch (level) {
    case "info":
      return "callout_info";
    case "important":
      return "callout_important";
  }
};

interface ToParse {
  nodeAttr: string | RegExp;
  translation: string;
}

export const translationParsing = (originalHTML: string, toParse: ToParse[]) => {
  let parsedHTML = originalHTML;
  for (const parsing of toParse) {
    parsedHTML = parsedHTML.replace(parsing.nodeAttr, `${parsing.nodeAttr} data-title='${parsing.translation}'`);
  }
  return parsedHTML;
};

export type TextSegment = { type: "text"; content: string };
export type CalloutSegment = { type: "callout"; calloutType: "important" | "info"; title: string; content: string };
export type ContentSegment = TextSegment | CalloutSegment;

/**
 * Parses HTML content to extract text and callout segments.
 * @param htmlContent The HTML content to parse.
 * @returns An object containing an array of content segments.
 */
export const htmlParsing = (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const body = doc.body;

  const contentSegments: ContentSegment[] = [];

  const processNode = (parentNode: Node) => {
    Array.from(parentNode.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && (node as Element).classList?.contains("callout")) {
        const element = node as Element;
        const isImportant = element.classList.contains("callout--important");
        const isInfo = element.classList.contains("callout--info");

        if (isImportant || isInfo) {
          const calloutType = isImportant ? "important" : "info";
          const title =
            element.getAttribute("data-title") ||
            (isImportant ? t(getCalloutTranslationKey("important")) : t(getCalloutTranslationKey("info")));
          const content = element.innerHTML;

          contentSegments.push({
            type: "callout",
            calloutType,
            title,
            content: sanitizeContent(content),
          });
        }
      } else {
        const tempDoc = document.implementation.createHTMLDocument("");
        const tempDiv = tempDoc.createElement("div");
        tempDiv.appendChild(node.cloneNode(true));

        if (tempDiv.innerHTML.trim()) {
          contentSegments.push({
            type: "text",
            content: sanitizeContent(tempDiv.innerHTML),
          });
        }
      }
    });
  };

  processNode(body);

  return {
    contentSegments,
  };
};
