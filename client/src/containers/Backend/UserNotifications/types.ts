import { Id } from "api-types";

export interface FormattedNotification {
  type: "reaction" | "annuaire" | "new content";
  read: boolean;
  link?: string;
  username?: string;
  createdAt?: Date;
  suggestionId?: string;
  text?: string;
  title?: string;
  dispositifId?: Id;
  typeContenu?: "dispositif" | "demarche";
}
