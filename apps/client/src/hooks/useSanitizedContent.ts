import DOMPurify from "isomorphic-dompurify";
import { useMemo } from "react";

export const SHORT_TEXT_ALLOWED_TAGS = [
  "b",
  "i",
  "em",
  "strong",
  "u",
  "br",
  "p",
  "span",
  "ul",
  "ol",
  "li",
];

export const useSanitizedContent = (content?: string, allowedTags?: string[]) => {
  const sanitized = useMemo(
    () =>
      content &&
      DOMPurify.sanitize(content, allowedTags ? { ALLOWED_TAGS: allowedTags } : undefined),
    [content, allowedTags],
  );
  return sanitized || "";
};
