import { useTranslation } from "next-i18next";
import { FullScreenPanel } from "~/components/Pages/learnFrench/FullScreenPanel";
import SearchMenuItem from "~/components/Pages/recherche/LocationMenu/SearchMenuItem";
import { LocationOptionsList, SelectedLocationsList } from "./LocationPopoverBody";
import { UseMyPositionButton } from "./UseMyPositionButton";
import { useLocationSelection } from "./useLocationSelection";

interface Props {
  open: boolean;
  departments: string[];
  cities: string[];
  resultCount: number;
  onChange: (departments: string[], cities: string[]) => void;
  onClose: () => void;
}

export const LocationPanel = (props: Props) => {
  const { t } = useTranslation();
  const selection = useLocationSelection(props.departments, props.cities, props.onChange);

  return (
    <FullScreenPanel
      open={props.open}
      title={t("LearnFrench.filters_location", "Localisation")}
      resultCount={props.resultCount}
      onClose={props.onClose}
      onReset={() => props.onChange([], [])}
    >
      <div className="flex flex-col gap-4">
        <SearchMenuItem onChange={selection.onSearchInputChange} />
        <SelectedLocationsList {...selection} />
        <div className="bg-alt-blue-france">
          <UseMyPositionButton
            t={selection.t}
            useMyPosition={selection.useMyPosition}
            geolocating={selection.geolocating}
          />
        </div>
        <LocationOptionsList {...selection} />
      </div>
    </FullScreenPanel>
  );
};
