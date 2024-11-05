export function sanitizeUrl(url: string): string {
  const URL_PROTOCOL = /^(?:https?|mailto|ftp|tel|file|sms)/gi;

  /** A pattern that matches safe  URLs. */
  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;

  url = String(url).trim();

  if (!url.match(URL_PROTOCOL)) return `https://${url}`;
  if (url.match(SAFE_URL_PATTERN)) return url;

  return "https://";
}
