import { UserId } from "~/typegoose";
import { TemplateName } from "../../connectors/sendgrid/sendgrid.types";
import { PREFS } from "./data";

export const consentsToEmail = (userId: UserId, templateName: TemplateName) => {
  const id = userId.toString();
  return PREFS[id]?.[templateName] ?? true;
};
