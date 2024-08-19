import { sanitize } from "dompurify";
import React, { useMemo } from "react";

export const useSanitizedContent = (content: string | React.ReactNode) => {
  const sanitized = useMemo(() => (typeof content === "string" ? sanitize(content) : content), [content]);
  return sanitized;
};
