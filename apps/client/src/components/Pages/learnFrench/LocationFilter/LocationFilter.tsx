import { useEffect, useRef, useState } from "react";
import SearchMenuItem from "~/components/Pages/recherche/LocationMenu/SearchMenuItem";
import { LocationPopoverBody } from "./LocationPopoverBody";
import { UseMyPositionButton } from "./UseMyPositionButton";
import { useLocationSelection } from "./useLocationSelection";

interface Props {
  departments: string[];
  cities: string[];
  onChange: (departments: string[], cities: string[]) => void;
}

export const LocationFilter = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selection = useLocationSelection(props.departments, props.cities, props.onChange);
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
    <div className="relative [&_.fr-input]:!bg-white" ref={containerRef}>
      <SearchMenuItem onFocus={() => setIsOpen(true)} onChange={selection.onSearchInputChange} />

      {selection.selectedLocationChips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selection.selectedLocationChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              aria-label={selection.t("LearnFrench.location_remove", "Retirer {{location}}", {
                location: chip.label,
              })}
              className="bg-action-high-blue-france inline-flex items-center gap-1 rounded-full py-1 pl-3 pr-2 text-sm text-white"
            >
              {chip.label}
              <i className="fr-icon-close-line fr-icon--sm" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="border-default-grey bg-default-grey absolute inset-x-0 top-full z-50 mt-1 divide-y divide-solid rounded-lg border shadow-[--raised-shadow]">
          <UseMyPositionButton
            t={selection.t}
            useMyPosition={selection.useMyPosition}
            geolocating={selection.geolocating}
          />
          <LocationPopoverBody {...selection} />
        </div>
      )}
    </div>
  );
};
