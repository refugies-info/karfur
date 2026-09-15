/**
 * Theme "Apprendre le français" (RI-1522 spike): dispositifs matching this page are those
 * whose `theme` or `secondaryThemes` is this id.
 */
export const LEARN_FRENCH_THEME_ID = "63286a015d31b2c0cad9960a";

/**
 * Needs under the "Apprendre le français" theme, used as the "Catégorie" filter (RI-1526).
 * Ids and order (position) confirmed against the theme's needs in database (RI-1522 spike).
 */
export const LEARN_FRENCH_NEED_IDS = {
  takeClasses: "613721a409c5190dfa70d057",
  forWork: "613721a409c5190dfa70d058",
  getADiploma: "613721a409c5190dfa70d05e",
  doActivitiesInFrench: "613721a409c5190dfa70d084",
  learnFrenchCulture: "613721a409c5190dfa70d06f",
  forUniversity: "613721a409c5190dfa70d060",
  testMyLevel: "613721a409c5190dfa70d05d",
} as const;

/**
 * Ids of the 4 dispositifs/démarches shown as static cards in the "How to learn French" section
 * (RI-1524). Confirmed against production content by title match (RI-1522 spike).
 */
export const HOW_TO_LEARN_FRENCH_CARD_IDS = {
  cir: "695e72ee48154115afadec89", // Signer le Contrat d'intégration républicaine (CIR)
  civicExam: "69947fe741807e63ce7a7030", // Préparer et passer l'examen civique
  certification: "63e66c6f1371d6d47fb60ed9", // Avoir une certification officielle du niveau de français
} as const;
