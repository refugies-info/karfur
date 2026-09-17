import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import type { useLocationSelection } from "./useLocationSelection";

type Selection = ReturnType<typeof useLocationSelection>;

interface Props extends Pick<Selection, "t" | "useMyPosition" | "geolocating"> {}

export const UseMyPositionButton = (props: Props) => (
  <div className="hover:bg-alt-blue-france flex items-center justify-between px-2.5 py-2">
    <button
      type="button"
      onClick={props.useMyPosition}
      onKeyDown={(e) => onEnterOrSpace(e, props.useMyPosition)}
      disabled={props.geolocating}
      className="text-title-blue-france flex items-start gap-2 text-base font-medium"
    >
      <i className="fr-icon-send-plane-fill fr-icon--sm p-1" aria-hidden="true" />
      {props.t("Recherche.positionButton", "Utiliser ma position")}
    </button>
  </div>
);
