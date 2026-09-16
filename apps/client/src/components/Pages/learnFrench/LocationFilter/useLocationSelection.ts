import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import {
  commonPlaces,
  fetchLocationSuggestions,
  getDepartmentFromCoordinates,
  type UnifiedSearchResult,
} from "~/components/Pages/recherche/LocationMenu/functions";
import { decodeHTMLEntities } from "~/lib/decodeHTMLEntities";

export const useLocationSelection = (
  departments: string[],
  cities: string[],
  onChange: (departments: string[], cities: string[]) => void,
) => {
  const { t } = useTranslation();
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
  const onSearchInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => debouncedSearchChange(event.target.value),
    [debouncedSearchChange],
  );

  const toggleLocation = useCallback(
    (kind: "department" | "city", value: string) => {
      const decoded = decodeHTMLEntities(value);
      const list = kind === "department" ? departments : cities;
      const exists = list.some((v) => decodeHTMLEntities(v) === decoded);
      const updated = exists
        ? list.filter((v) => decodeHTMLEntities(v) !== decoded)
        : [...list, decoded];
      onChange(kind === "department" ? updated : departments, kind === "city" ? updated : cities);
    },
    [departments, cities, onChange],
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
    ...departments.map((department) => ({
      label: decodeHTMLEntities(department),
      nativeInputProps: {
        checked: true,
        onChange: () => toggleLocation("department", department),
      },
    })),
    ...cities.map((city) => {
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
    const isChecked = cities.some((city) => decodeHTMLEntities(city) === decodedCityName);
    return {
      label: `${placeName} (${deptNo})`,
      nativeInputProps: { checked: isChecked, onChange: () => toggleLocation("city", placeName) },
    };
  });

  const resultOptions = suggestions.map((result) => ({
    label: `${result.displayName} (${result.deptCode})`,
    nativeInputProps: {
      checked:
        result.type === "department"
          ? departments.some((d) => decodeHTMLEntities(d) === result.deptName)
          : cities.some((c) => decodeHTMLEntities(c) === result.displayName),
      onChange: () => toggleLocation(result.type, result.displayName),
    },
  }));

  return {
    t,
    search,
    geolocating,
    onSearchInputChange,
    useMyPosition,
    selectedLocations,
    commonPlacesOptions,
    resultOptions,
  };
};
