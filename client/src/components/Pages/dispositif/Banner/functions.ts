import { DispositifStatus } from "api-types";

import { BadgeProps } from "reactstrap";

type Status = {
  text: string;
  type: BadgeProps["type"];
  icon?: string;
}

export const getStatus = (status: DispositifStatus | undefined, isAdmin: boolean): Status | null => {
  if (!status) return null;
  switch (status) {
    case DispositifStatus.ACTIVE:
      return {
        text: "Fiche publiée",
        type: "success",
      };
    case DispositifStatus.DELETED:
      return {
        text: "Fiche supprimée",
        type: "error",
        icon: "ri-close-circle-fill"
      };
    case DispositifStatus.DRAFT:
      return {
        text: "Brouillon",
        type: "new",
        icon: "ri-pencil-fill"
      };
    case DispositifStatus.KO_STRUCTURE:
      return {
        text: "Rejeté par la structure",
        type: "error",
        icon: "ri-close-circle-fill"
      };
    case DispositifStatus.NO_STRUCTURE:
      return null;
    case DispositifStatus.OK_STRUCTURE:
      return null;
    case DispositifStatus.WAITING:
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
