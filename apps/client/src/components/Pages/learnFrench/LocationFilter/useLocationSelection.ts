import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import {
  type CitySelection,
  commonPlaces,
  fetchLocationSuggestions,
  getDepartmentFromCoordinates,
  type UnifiedSearchResult,
} from "~/components/Pages/recherche/LocationMenu/functions";
import { decodeHTMLEntities } from "~/lib/decodeHTMLEntities";

export const useLocationSelection = (
  departments: string[],
  cities: CitySelection[],
  onChange: (departments: string[], cities: CitySelection[]) => void,
) => {
  const { t } = useTranslation();
  const announce = useAnnounce();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<UnifiedSearchResult[]>([]);
  const [geolocating, setGeolocating] = useState(false);

  const announceResults = useCallback(
    (count: number) => {
      announce(t("Recherche.citySelectionsResults", { count }), { delay: 1500 });
    },
    [announce, t],
  );

  const fetchSuggestionsFor = useCallback(
    async (value: string) => {
      try {
        const results = await fetchLocationSuggestions(value);
        setSuggestions(results);
        announceResults(results.length);
      } catch {
        setSuggestions([]);
        announceResults(0);
      }
    },
    [announceResults],
  );

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestionsFor, 500),
    [fetchSuggestionsFor],
  );

  const onSearchInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      if (value.length <= 2) {
        debouncedFetchSuggestions.cancel();
        setSuggestions([]);
        announceResults(0);
        return;
      }
      debouncedFetchSuggestions(value);
    },
    [debouncedFetchSuggestions, announceResults],
  );

  const toggleDepartment = useCallback(
    (value: string) => {
      const decoded = decodeHTMLEntities(value);
      const exists = departments.some((v) => decodeHTMLEntities(v) === decoded);
      const updated = exists
        ? departments.filter((v) => decodeHTMLEntities(v) !== decoded)
        : [...departments, decoded];
      onChange(updated, cities);
    },
    [departments, cities, onChange],
  );

  const toggleCity = useCallback(
    (name: string, department: string) => {
      const decodedName = decodeHTMLEntities(name);
      const exists = cities.some((city) => decodeHTMLEntities(city.name) === decodedName);
      const updated = exists
        ? cities.filter((city) => decodeHTMLEntities(city.name) !== decodedName)
        : [...cities, { name: decodedName, department: decodeHTMLEntities(department) }];
      onChange(departments, updated);
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
            if (department) toggleDepartment(department);
          })
          .finally(() => setGeolocating(false));
      },
      () => setGeolocating(false),
    );
  }, [toggleDepartment]);

  const selectedLocations = [
    ...departments.map((department) => ({
      label: decodeHTMLEntities(department),
      nativeInputProps: {
        checked: true,
        onChange: () => toggleDepartment(department),
      },
    })),
    ...cities.map((city) => {
      const decoded = decodeHTMLEntities(city.name);
      const commonPlace = commonPlaces.find(
        (place) => decodeHTMLEntities(place.placeName) === decoded,
      );
      return {
        label: commonPlace ? `${decoded} (${commonPlace.deptNo})` : decoded,
        nativeInputProps: {
          checked: true,
          onChange: () => toggleCity(city.name, city.department),
        },
      };
    }),
  ];

  const selectedLocationChips = [
    ...departments.map((department) => ({
      key: `department-${department}`,
      label: decodeHTMLEntities(department),
      onRemove: () => toggleDepartment(department),
    })),
    ...cities.map((city) => ({
      key: `city-${city.name}`,
      label: decodeHTMLEntities(city.name),
      onRemove: () => toggleCity(city.name, city.department),
    })),
  ];

  const commonPlacesOptions = commonPlaces.map(({ deptNo, placeName, deptName }) => {
    const decodedCityName = decodeHTMLEntities(placeName);
    const isChecked = cities.some((city) => decodeHTMLEntities(city.name) === decodedCityName);
    return {
      label: `${placeName} (${deptNo})`,
      nativeInputProps: { checked: isChecked, onChange: () => toggleCity(placeName, deptName) },
    };
  });

  const resultOptions = suggestions.map((result) => ({
    label: `${result.displayName} (${result.deptCode})`,
    nativeInputProps: {
      checked:
        result.type === "department"
          ? departments.some((d) => decodeHTMLEntities(d) === result.deptName)
          : cities.some((c) => decodeHTMLEntities(c.name) === result.displayName),
      onChange: () =>
        result.type === "department"
          ? toggleDepartment(result.displayName)
          : toggleCity(result.displayName, result.deptName),
    },
  }));

  return {
    t,
    search,
    geolocating,
    onSearchInputChange,
    useMyPosition,
    selectedLocations,
    selectedLocationChips,
    commonPlacesOptions,
    resultOptions,
  };
};
