import { Moment } from "moment";
import { ObjectId } from "mongodb";

export interface FormattedNotification {
  type: "reaction" | "annuaire" | "new content";
  read: boolean;
  link?: string;
  username?: string;
  createdAt?: Moment;
  suggestionId?: string;
  text?: string;
  title?: string;
  dispositifId?: ObjectId;
}
