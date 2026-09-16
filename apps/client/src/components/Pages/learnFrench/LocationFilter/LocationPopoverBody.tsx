import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import type { useLocationSelection } from "./useLocationSelection";

type Selection = ReturnType<typeof useLocationSelection>;

interface Props extends Selection {}

export const LocationPopoverBody = (props: Props) => (
  <>
    {props.selectedLocations.length > 0 && (
      <div className="p-3">
        <Checkbox
          legend={props.t("Recherche.selectedLocations", "Localisations sélectionnées")}
          className="!mb-0 w-full"
          options={props.selectedLocations}
        />
      </div>
    )}

    <button
      type="button"
      onClick={props.useMyPosition}
      onKeyDown={(e) => onEnterOrSpace(e, props.useMyPosition)}
      disabled={props.geolocating}
      className="text-title-blue-france flex w-full items-center gap-2 p-3 text-sm"
    >
      <i className="fr-icon-send-plane-fill fr-icon--sm" aria-hidden="true" />
      {props.t("Recherche.positionButton", "Utiliser ma position")}
    </button>

    <div className="max-h-80 overflow-y-auto p-3">
      {props.search !== "" ? (
        <Checkbox
          legend={props.t("Recherche.searchResultsLegend", "Résultats de recherche")}
          className="!mb-0 w-full"
          options={props.resultOptions}
        />
      ) : (
        <Checkbox
          legend={props.t("Recherche.commonPlaces", "Villes courantes")}
          className="!mb-0 w-full"
          options={props.commonPlacesOptions}
        />
      )}
    </div>
  </>
);
