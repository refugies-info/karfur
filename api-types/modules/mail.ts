import { Id } from "../generics";

/**
 * @url POST /sendAdminImprovementsMail
 */
export interface ImprovementsRequest {
  dispositifId: Id;
  users: {
    username: string;
    _id: Id;
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
