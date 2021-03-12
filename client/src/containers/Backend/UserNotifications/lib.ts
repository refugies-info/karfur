import { IDispositif } from "../../../types/interface";
import { Moment } from "moment";

interface FormattedNotification {
  type: "reaction" | "annuaire" | "new content";
  read: boolean;
  link?: string;
  username?: string;
  createdAt?: Moment;
  suggestionId?: string;
  text?: string;
  title?: string;
}
export const formatNotifications = (
  dispositifs: IDispositif[],
  hasResponsibleSeenAnnuaireNotif: boolean
): FormattedNotification[] => {
  let result: FormattedNotification[] = [];
  if (!hasResponsibleSeenAnnuaireNotif) {
    result.push({ type: "annuaire", read: false });
  }
  if (!dispositifs) return [];
  dispositifs.forEach((dispo) => {
    if (dispo.status === "En attente") {
      result.push({
        type: "new content",
        link: "/" + dispo.typeContenu + "/" + dispo._id,
        read: false,
        createdAt: dispo.created_at,
      });
    }
    if (!dispo.suggestions) return;
    dispo.suggestions.forEach((suggestion) => {
      result.push({
        type: "reaction",
        username: suggestion.username,
        createdAt: suggestion.createdAt,
        suggestionId: suggestion.suggestionId,
        read: !!suggestion.read,
        text: suggestion.suggestion,
        title: dispo.titreInformatif,
      });
    });
  });
  result.sort((a, b) => {
    if (!a.read) return -1;
    if (!b.read) return 1;
    return 1;
  });
  return result;
};
