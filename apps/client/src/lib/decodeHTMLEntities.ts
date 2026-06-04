/**
 * Décodes HTML entities in a string (e.g., &#39; to ', &quot; to ", &amp; to &)
 * Useful for any text that may contain encoded HTML entities
 * @param text - The text to decode
 * @returns The decoded text
 */
export const decodeHTMLEntities = (text: string): string => {
  try {
    const decoded = decodeURIComponent(text);
    return decoded
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
  } catch (e) {
    return text
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
  }
};
