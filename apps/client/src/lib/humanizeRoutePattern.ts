/**
 * Turns a Next.js route pattern into a readable label.
 *
 * Used as the announced fallback when a route is served without a `<title>`
 * (RGAA 12.8): announcing a raw URL path or focusing an empty paragraph would
 * be worse than a humanized route pattern. Dynamic segments lose their
 * brackets, so `/dispositif/[id]` gives "Dispositif id".
 *
 * Returns an empty string when the pattern carries no readable segment.
 */
export const humanizeRoutePattern = (pathname: string): string => {
  const label = pathname
    .replace(/[[\]]|\.{3}/g, "")
    .split("/")
    .filter(Boolean)
    .join(" ")
    .replace(/-/g, " ")
    .trim();
  if (!label) return "";
  return label.charAt(0).toUpperCase() + label.slice(1);
};
