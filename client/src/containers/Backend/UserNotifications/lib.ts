import { IDispositif } from "../../../types/interface";
import { FormattedNotification } from "./types";

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
        typeContenu: dispo.typeContenu,
      });
    });
  });
  result.sort((a, b) => {
    if (a.read && !b.read) {
      return 1;
    }
    if (!a.read && b.read) {
      return -1;
    }
    if (!a.read && !b.read) {
      if (a.type === "annuaire") {
        return -1;
      }
      if (b.type === "annuaire") {
        return 1;
      }
      if (
        a.type === "new content" &&
        b.type === "new content" &&
        a.createdAt &&
        b.createdAt &&
        a.createdAt < b.createdAt
      ) {
        return 1;
      }

      if (a.type === "new content") {
        return -1;
      }
      if (b.type === "new content") {
        return 1;
      }

      if (a.createdAt && b.createdAt && a.createdAt > b.createdAt) return -1;
      return 1;
    }
    //trie par date les notifs lues
    if (a.createdAt && b.createdAt && a.createdAt > b.createdAt) return -1;
    return 1;
  });
  return result;
};

export const getNbNewNotifications = (
  dispositifs: IDispositif[],
  hasResponsibleSeenAnnuaireNotif: boolean
) => {
  const formattedNotifications = formatNotifications(
    dispositifs,
    hasResponsibleSeenAnnuaireNotif
  );
  return formattedNotifications.filter((notif) => !notif.read).length;
};
