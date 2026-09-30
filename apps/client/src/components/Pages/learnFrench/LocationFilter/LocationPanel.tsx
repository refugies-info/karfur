import { useTranslation } from "next-i18next";
import { FullScreenPanel } from "~/components/Pages/learnFrench/FullScreenPanel";
import type { CitySelection } from "~/components/Pages/recherche/LocationMenu/functions";
import SearchMenuItem, {
  BLUE_UNDERLINE_CLASSNAME,
} from "~/components/Pages/recherche/LocationMenu/SearchMenuItem";
import { LocationOptionsList, SelectedLocationsList } from "./LocationPopoverBody";
import { UseMyPositionButton } from "./UseMyPositionButton";
import { useLocationSelection } from "./useLocationSelection";

interface Props {
  open: boolean;
  departments: string[];
  cities: CitySelection[];
  resultCount: number;
  onChange: (departments: string[], cities: CitySelection[]) => void;
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
        <SearchMenuItem
          onChange={selection.onSearchInputChange}
          className={`${BLUE_UNDERLINE_CLASSNAME} [&_.fr-input]:!bg-alt-grey`}
        />
        <SelectedLocationsList {...selection} />
        <div className="bg-alt-blue-france">
          <UseMyPositionButton
            t={selection.t}
            useMyPosition={selection.useMyPosition}
            geolocating={selection.geolocating}
          />
        </div>
        <div className="bg-[var(--color-border-default-grey)] h-px" aria-hidden="true" />
        <LocationOptionsList {...selection} />
      </div>
    </FullScreenPanel>
  );
};
