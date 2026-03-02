import type { TemplateName } from "~/connectors/sendgrid/sendgrid.types";

// TODO: This should be implemented in the database with a UI etc...

// Default mail preferences for structures with restricted sending:
// only transactional/critical mails are allowed; marketing and reminders are blocked.
const DEFAULT_MAIL_PREFS: Record<TemplateName, boolean> = {
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

export const PREFS: Record<string, Record<TemplateName, boolean>> = {
  // "programme agir"
  "65f8245fd9babd17f5825aac": DEFAULT_MAIL_PREFS,
  // "réseau Mens"
  "63985164fd1bf4e22792ef6e": {
    ...DEFAULT_MAIL_PREFS,
    publishedFicheToCreator: false,
    publishedFicheToStructureMembers: false,
    ficheArchived: false,
  },
};
