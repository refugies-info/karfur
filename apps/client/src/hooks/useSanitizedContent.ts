import DOMPurify from "isomorphic-dompurify";
import { useMemo } from "react";

export const useSanitizedContent = (content?: string) => {
  const sanitized = useMemo(() => content && DOMPurify.sanitize(content), [content]);
  return sanitized || "";
};
