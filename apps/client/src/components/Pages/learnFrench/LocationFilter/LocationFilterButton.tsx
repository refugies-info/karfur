import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import SearchMenuItem from "~/components/Pages/recherche/LocationMenu/SearchMenuItem";
import { cls } from "~/lib/classname";
import { summarizeLocations } from "~/lib/learnFrench/summarizeLocations";
import { LocationPopoverBody } from "./LocationPopoverBody";
import { UseMyPositionButton } from "./UseMyPositionButton";
import { useLocationSelection } from "./useLocationSelection";

interface Props {
  departments: string[];
  cities: string[];
  onChange: (departments: string[], cities: string[]) => void;
}

export const LocationFilterButton = (props: Props) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selection = useLocationSelection(props.departments, props.cities, props.onChange);
  const hasSelection = props.departments.length > 0 || props.cities.length > 0;

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
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cls(
          "text-h5 inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold",
          hasSelection
            ? "bg-action-low-blue-france text-title-blue-france"
            : "bg-default-grey hover:bg-open-blue-france",
        )}
      >
        {hasSelection ? (
          <>
            {summarizeLocations([...props.departments, ...props.cities])}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                props.onChange([], []);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  props.onChange([], []);
                }
              }}
              className="bg-action-high-blue-france flex h-6 w-6 items-center justify-center rounded-full"
              aria-label={t("LearnFrench.location_clear", "Effacer la localisation")}
            >
              <i className="fr-icon-close-line fr-icon--sm text-white" aria-hidden="true" />
            </span>
          </>
        ) : (
          <>
            {t("LearnFrench.location_placeholder", "Choisir la ville")}
            <i className="fr-icon-arrow-down-s-line" aria-hidden="true" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="border-default-grey absolute inset-x-0 top-full z-50 mt-1 min-w-64 divide-y divide-solid rounded-lg border bg-white shadow-[0_4px_12px_0_rgba(0,0,18,0.16)]">
          <UseMyPositionButton
            t={selection.t}
            useMyPosition={selection.useMyPosition}
            geolocating={selection.geolocating}
          />
          <div className="[&_.fr-input]:!bg-white p-3">
            <SearchMenuItem onChange={selection.onSearchInputChange} />
          </div>
          <LocationPopoverBody {...selection} />
        </div>
      )}
    </div>
  );
};
