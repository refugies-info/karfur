import DOMPurify from "isomorphic-dompurify";
import isInBrowser from "./isInBrowser";

/**
 * Sanitizes HTML content without using React hooks
 * Safe to use in both browser and server environments
 */
export const sanitizeContent = (content?: string): string => {
  if (!content) return "";
  
  // Only sanitize in browser environment
  if (isInBrowser()) {
    return DOMPurify.sanitize(content);
  }
  
  // Return the content as is on the server
  return content;
};
