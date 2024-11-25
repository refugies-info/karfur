/**
 * @url POST /sendAdminImprovementsMail
 */
export interface ImprovementsRequest {
  dispositifId: string;
  userIds: string[];
  titreInformatif: string;
  titreMarque: string;
  sections: string[];
  message: string;
}

/**
 * @url POST /sendSubscriptionReminderMail
 */
export interface SubscriptionRequest {
  email: string;
}

/**
 * @url POST /contacts
 */
export interface AddContactRequest {
  email: string;
}

/**
 * @url GET /contacts
 */
export interface IsInContactResponse {
  isInContacts: boolean;
}
