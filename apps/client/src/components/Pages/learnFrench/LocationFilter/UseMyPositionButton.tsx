import type { useLocationSelection } from "./useLocationSelection";

type Selection = ReturnType<typeof useLocationSelection>;

interface Props extends Pick<Selection, "t" | "useMyPosition" | "geolocating"> {}

export const UseMyPositionButton = (props: Props) => (
  <div className="hover:bg-alt-blue-france flex items-center justify-between px-2.5 py-2">
    <button
      type="button"
      onClick={props.useMyPosition}
      disabled={props.geolocating}
      className="text-blue-france-sun-113-hover flex items-center gap-2 text-base font-medium"
    >
      <i className="fr-icon-send-plane-fill fr-icon--sm p-1" aria-hidden="true" />
      {props.t("Recherche.positionButton", "Utiliser ma position")}
    </button>
  </div>
);
