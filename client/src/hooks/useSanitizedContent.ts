import { sanitize } from "dompurify";
import { useMemo } from "react";

export const useSanitizedContent = (content: string) => {
  const sanitized = useMemo(() => sanitize(content), [content]);
  return sanitized;
};
