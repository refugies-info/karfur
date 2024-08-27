import { sanitize } from "isomorphic-dompurify";
import { useMemo } from "react";

export const useSanitizedContent = (content?: string) => {
  const sanitized = useMemo(() => content && sanitize(content), [content]);
  return sanitized || "";
};
