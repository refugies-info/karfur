import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
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
