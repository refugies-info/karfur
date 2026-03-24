import type { TemplateName } from "~/connectors/sendgrid/sendgrid.types";

// TODO: This should be implemented in the database with a UI etc...

// Default mail preferences for users/structures with restricted sending:
// only transactional/critical mails are allowed; marketing and reminders are blocked.
export const DEFAULT_MAIL_PREFS: Record<TemplateName, boolean> = {
  newUserWelcome: false,
  resetPassword: true,
  subscriptionReminderMail: false,
  oneDraftReminder: false,
  secondOneDraftReminder: false,
  updateReminder: false,
  multipleDraftsReminder: false,
  secondMultipleDraftReminder: false,
  publishedFicheToStructureMembers: true,
  publishedFicheToCreator: true,
  publishedTradForStructure: false,
  newFicheEnAttente: false,
  publishedTradForTraductors: false,
  reviewFiche: false,
  newMember: false,
  accountDeleted: true,
  validatedAndPublished: false,
  ficheArchived: true,
  newsletterSubscriptionConfirmation: true,
};

/**
 * User-level mail preferences (keyed by user ID).
 * Use for specific users who need custom email behavior.
 * A `false` setting here will block the email for that user.
 */
export const USER_PREFS: Record<string, Record<TemplateName, boolean>> = {
  // "programme agir" user
  "65f8245fd9babd17f5825aac": DEFAULT_MAIL_PREFS,
};

/**
 * Structure-level mail preferences (keyed by structure ID).
 * These apply to ALL members of the structure, but ONLY for emails related to that structure.
 * A `false` setting here will block an email for all members of the structure.
 *
 * IMPORTANT: Callers MUST pass `structureId` to `consentsToEmail()` for structure-related emails.
 * If `structureId` is not provided, structure-level preferences will NOT be checked.
 */
export const STRUCTURE_PREFS: Record<string, Record<TemplateName, boolean>> = {
  // "réseau Mens"
  "63985164fd1bf4e22792ef6e": {
    ...DEFAULT_MAIL_PREFS,
    ficheArchived: false,
    publishedFicheToCreator: false,
    publishedFicheToStructureMembers: false,
    validatedAndPublished: false,
  },
};
