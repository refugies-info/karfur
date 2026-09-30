import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import type { CitySelection } from "~/components/Pages/recherche/LocationMenu/functions";
import SearchMenuItem, {
  BLUE_UNDERLINE_CLASSNAME,
} from "~/components/Pages/recherche/LocationMenu/SearchMenuItem";
import { useIsDesktopLayout } from "~/hooks/learnFrench/useIsDesktopLayout";
import { summarizeLocations } from "~/lib/learnFrench/summarizeLocations";
import { LocationPopoverBody } from "./LocationPopoverBody";
import { UseMyPositionButton } from "./UseMyPositionButton";
import { useLocationSelection } from "./useLocationSelection";

interface Props {
  departments: string[];
  cities: CitySelection[];
  onChange: (departments: string[], cities: CitySelection[]) => void;
  onOpenPanel: () => void;
}

export const LocationFilterButton = (props: Props) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selection = useLocationSelection(props.departments, props.cities, props.onChange);
  const hasSelection = props.departments.length > 0 || props.cities.length > 0;
  const isDesktopLayout = useIsDesktopLayout();
  const openLocationPicker = () =>
    isDesktopLayout ? setIsOpen((open) => !open) : props.onOpenPanel();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative -mt-2 inline-block align-middle" ref={containerRef}>
      {hasSelection ? (
        <div className="text-h6 md:text-h5 bg-action-low-blue-france inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold">
          <button
            type="button"
            onClick={openLocationPicker}
            className="text-blue-france-sun-113-hover inline-flex items-center leading-none"
          >
            {summarizeLocations([...props.departments, ...props.cities.map((city) => city.name)])}
          </button>
          <button
            type="button"
            onClick={() => props.onChange([], [])}
            className="bg-blue-france-sun-113-hover flex h-6 w-6 items-center justify-center rounded-full"
            aria-label={t("LearnFrench.location_clear", "Effacer la localisation")}
          >
            <i className="fr-icon-close-line fr-icon--sm text-white" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openLocationPicker}
          className="text-h6 md:text-h5 bg-default-grey hover:bg-open-blue-france inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold"
        >
          {t("LearnFrench.location_placeholder", "Choisir la ville")}
          <i className="fr-icon-arrow-down-s-line" aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <div className="border-default-grey bg-default-grey absolute inset-x-0 top-full z-50 mt-1 min-w-64 divide-y divide-solid rounded-lg border shadow-[--raised-shadow]">
          <UseMyPositionButton
            t={selection.t}
            useMyPosition={selection.useMyPosition}
            geolocating={selection.geolocating}
          />
          <div className="[&_.fr-input]:!bg-white p-3">
            <SearchMenuItem
              onChange={selection.onSearchInputChange}
              className={BLUE_UNDERLINE_CLASSNAME}
            />
          </div>
          <LocationPopoverBody {...selection} />
        </div>
      )}
    </div>
  );
};
