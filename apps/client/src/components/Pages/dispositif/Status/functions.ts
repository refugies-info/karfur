import { BadgeProps } from "@codegouvfr/react-dsfr/Badge";
import { DispositifStatus } from "@refugies-info/api-types";

type Status = {
  text: string;
  type: BadgeProps["severity"];
  icon?: string;
}

export const getStatus = (status: DispositifStatus | undefined, hasDraftVersion: boolean, isAdmin: boolean): Status | null => {
  if (!status) return null;
  switch (status) {
    case DispositifStatus.ACTIVE:
      return {
        text: "Fiche publiée",
        type: "success",
        icon: "ri-checkbox-circle-fill"
      };
    case DispositifStatus.DELETED:
      return {
        text: "Fiche supprimée",
        type: "error",
        icon: "ri-close-circle-fill"
      };
    case DispositifStatus.DRAFT:
      return {
        text: hasDraftVersion ? "Nouvelle version en cours" : "Brouillon",
        type: "new",
        icon: "ri-pencil-fill"
      };
    case DispositifStatus.KO_STRUCTURE:
      return {
        text: "Rejeté par la structure",
        type: "error",
        icon: "ri-close-circle-fill"
      };
    case DispositifStatus.OK_STRUCTURE:
      return null;
    case DispositifStatus.WAITING_STRUCTURE:
      return {
        text: "Relecture par la structure",
        type: "warning",
        icon: "ri-time-fill"
      };
    case DispositifStatus.WAITING_ADMIN:
      return {
        text: isAdmin ? "À valider" : "Relecture en cours",
        type: "warning",
        icon: "ri-time-fill"
      };
  }
}
