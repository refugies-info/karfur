import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML content without using React hooks
 * Safe to use in both browser and server environments
 */
export const sanitizeContent = (content?: string): string => {
  if (!content) return "";

  return DOMPurify.sanitize(content);
};
