/**
 * Static Pages URLs
 *
 * List of static pages to test for visual regression.
 * These pages exist in both prod and staging.
 */

export const STATIC_PAGES = [
  { name: "Home", path: "/" },
  { name: "Recherche", path: "/recherche" },
  { name: "Mentions légales", path: "/mentions-legales" },
  { name: "Politique de confidentialité", path: "/politique-de-confidentialite" },
  { name: "Plan du site", path: "/plan-du-site" },
  { name: "Mission et Impact", path: "/mission-et-impact" },
  { name: "Télécharger l'app", path: "/download-app" },
  { name: "Déclaration d'accessibilité", path: "/declaration-accessibilite" },
  { name: "Publier", path: "/publier" },
  { name: "Traduire", path: "/traduire" },
  { name: "Agir", path: "/agir" },
  { name: "404", path: "/404" },
] as const;

export type StaticPage = (typeof STATIC_PAGES)[number];
