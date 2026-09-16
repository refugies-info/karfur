import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  commonPlaces,
  fetchLocationSuggestions,
  getDepartmentFromCoordinates,
  type UnifiedSearchResult,
} from "~/components/Pages/recherche/LocationMenu/functions";
import SearchMenuItem from "~/components/Pages/recherche/LocationMenu/SearchMenuItem";
import { decodeHTMLEntities } from "~/lib/decodeHTMLEntities";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";

interface Props {
  departments: string[];
  cities: string[];
  onChange: (departments: string[], cities: string[]) => void;
}

export const LocationFilter = (props: Props) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<UnifiedSearchResult[]>([]);
  const [geolocating, setGeolocating] = useState(false);

  const handleSearchChange = useCallback(async (value: string) => {
    setSearch(value);
    if (value.length <= 2) {
      setSuggestions([]);
      return;
    }
    setSuggestions(await fetchLocationSuggestions(value));
  }, []);

  const debouncedSearchChange = useMemo(
    () => debounce(handleSearchChange, 500),
    [handleSearchChange],
  );

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

  const toggleLocation = useCallback(
    (kind: "department" | "city", value: string) => {
      const decoded = decodeHTMLEntities(value);
      const list = kind === "department" ? props.departments : props.cities;
      const exists = list.some((v) => decodeHTMLEntities(v) === decoded);
      const updated = exists
        ? list.filter((v) => decodeHTMLEntities(v) !== decoded)
        : [...list, decoded];
      props.onChange(
        kind === "department" ? updated : props.departments,
        kind === "city" ? updated : props.cities,
      );
    },
    [props],
  );

  const useMyPosition = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getDepartmentFromCoordinates(position.coords.latitude, position.coords.longitude)
          .then((department) => {
            if (department) toggleLocation("department", department);
          })
          .finally(() => setGeolocating(false));
      },
      () => setGeolocating(false),
    );
  }, [toggleLocation]);

  const selectedLocations = [
    ...props.departments.map((department) => ({
      label: decodeHTMLEntities(department),
      nativeInputProps: {
        checked: true,
        onChange: () => toggleLocation("department", department),
      },
    })),
    ...props.cities.map((city) => {
      const decoded = decodeHTMLEntities(city);
      const commonPlace = commonPlaces.find(
        (place) => decodeHTMLEntities(place.placeName) === decoded,
      );
      return {
        label: commonPlace ? `${decoded} (${commonPlace.deptNo})` : decoded,
        nativeInputProps: { checked: true, onChange: () => toggleLocation("city", city) },
      };
    }),
  ];

  const commonPlacesOptions = commonPlaces.map(({ deptNo, placeName }) => {
    const decodedCityName = decodeHTMLEntities(placeName);
    const isChecked = props.cities.some((city) => decodeHTMLEntities(city) === decodedCityName);
    return {
      label: `${placeName} (${deptNo})`,
      nativeInputProps: { checked: isChecked, onChange: () => toggleLocation("city", placeName) },
    };
  });

  return (
    <div>
      <div className="relative" ref={containerRef}>
        <SearchMenuItem
          onFocus={() => setIsOpen(true)}
          onChange={(e) => debouncedSearchChange(e.target.value)}
        />

        {isOpen && (
          <div className="border-default-grey absolute inset-x-0 top-full z-50 mt-1 divide-y divide-solid rounded-lg border bg-white shadow-[0_4px_12px_0_rgba(0,0,18,0.16)]">
            {selectedLocations.length > 0 && (
              <div className="p-3">
                <Checkbox
                  legend={t("Recherche.selectedLocations", "Localisations sélectionnées")}
                  className="!mb-0 w-full"
                  options={selectedLocations}
                />
              </div>
            )}

            <button
              type="button"
              onClick={useMyPosition}
              onKeyDown={(e) => onEnterOrSpace(e, useMyPosition)}
              disabled={geolocating}
              className="text-title-blue-france flex w-full items-center gap-2 p-3 text-sm"
            >
              <i className="fr-icon-send-plane-fill fr-icon--sm" aria-hidden="true" />
              {t("Recherche.positionButton", "Utiliser ma position")}
            </button>

            <div className="max-h-80 overflow-y-auto p-3">
              {search !== "" ? (
                <Checkbox
                  legend={t("Recherche.searchResultsLegend", "Résultats de recherche")}
                  className="!mb-0 w-full"
                  options={suggestions.map((result) => ({
                    label: `${result.displayName} (${result.deptCode})`,
                    nativeInputProps: {
                      checked:
                        result.type === "department"
                          ? props.departments.some((d) => decodeHTMLEntities(d) === result.deptName)
                          : props.cities.some((c) => decodeHTMLEntities(c) === result.displayName),
                      onChange: () => toggleLocation(result.type, result.displayName),
                    },
                  }))}
                />
              ) : (
                <Checkbox
                  legend={t("Recherche.commonPlaces", "Villes courantes")}
                  className="!mb-0 w-full"
                  options={commonPlacesOptions}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
