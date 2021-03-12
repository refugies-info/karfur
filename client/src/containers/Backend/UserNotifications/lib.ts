import { IDispositif } from "../../../types/interface";
import { FormattedNotification } from "./types";
import API from "../../../utils/API";

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
        dispositifId: dispo._id,
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

export const deleteNotification = async (
  notification: FormattedNotification
) => {
  let dispositif = {
    dispositifId: notification.dispositifId,
    suggestionId: notification.suggestionId,
    fieldName: "suggestions",
    type: "pull",
  };
  return await API.update_dispositif(dispositif);
};

export const readNotification = async (notif: FormattedNotification) => {
  const dispositif = {
    dispositifId: notif.dispositifId,
    suggestionId: notif.suggestionId,
    fieldName: "suggestions.$.read",
    type: "set",
  };
  API.update_dispositif(dispositif);
};
