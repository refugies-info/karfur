import { IDispositif } from "../../../types/interface";

export const formatNotifications = (
  dispositifs: IDispositif[],
  hasResponsibleSeenAnnuaireNotif: boolean
) => {
  let result = [];
  if (hasResponsibleSeenAnnuaireNotif) {
    result.push({ type: "annuaire", read: true });
  }
  dispositifs.forEach((dispo) => {
    if (dispo.status === "En attente") {
      result.push({
        type: "new content",
        link: dispo.typeContenu + "/" + dispo._id,
        read: false,
      });
    }
    dispo.suggestions.forEach((suggestion) => {
      result.push({
        type: "reaction",
        username: suggestion.username,
        createdAt: suggestion.createdAt,
        suggestionId: suggestion.suggestionId,
        read: suggestion.read,
        text: suggestion.suggestion,
      });
    });
  });
  return result;
};
