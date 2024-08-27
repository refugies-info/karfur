import { TemplateName } from "~/connectors/sendgrid/sendgrid.types";

// TODO: This should be implemented in the database with a UI etc...

export const PREFS: Record<string, Record<TemplateName, boolean>> = {
  // "programme agir"
  "65f8245fd9babd17f5825aac": {
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
    newResponsable: false,
    accountDeleted: true,
  },
};
