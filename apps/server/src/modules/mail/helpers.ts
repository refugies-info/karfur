import type { UserId } from "~/typegoose";
import type { TemplateName } from "../../connectors/sendgrid/sendgrid.types";
import { PREFS } from "./data";

export const consentsToEmail = (userId: UserId, templateName: TemplateName) => {
  const id = userId.toString();
  return PREFS[id]?.[templateName] ?? true;
};
