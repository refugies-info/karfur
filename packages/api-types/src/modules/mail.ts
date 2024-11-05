/**
 * @url POST /sendAdminImprovementsMail
 */
export interface ImprovementsRequest {
  dispositifId: string;
  users: {
    username?: string;
    _id: string;
    email: string;
  }[];
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
