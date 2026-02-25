import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { cn } from "@refugies-info/ui";
import debounce from "lodash/debounce";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { useSearchEventName } from "~/hooks";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import {
  searchPaginationSelector,
  searchQuerySelector,
  searchResultsSelector,
} from "~/services/SearchResults/searchResults.selector";
import {
  getCitiesForDepartment,
  getDepartmentForCity,
  sortByRelevance,
  transformDepartmentResult,
  transformMunicipalityResult,
  type UnifiedSearchResult,
} from "./functions";
import GeoLocationMenuItem from "./GeoLocationMenuItem";
import styles from "./LocationMenu.module.css";
import SearchMenuItem from "./SearchMenuItem";

type ScreenReaderAnnounceOptions = NonNullable<Parameters<ReturnType<typeof useAnnounce>>[1]>;

const commonPlaces = [
  { placeName: "Paris", deptNo: "75", deptName: "Paris" },
  { placeName: "Lyon", deptNo: "69", deptName: "Rhône" },
  { placeName: "Strasbourg", deptNo: "67", deptName: "Bas-Rhin" },
  { placeName: "Nantes", deptNo: "44", deptName: "Loire-Atlantique" },
  { placeName: "Dijon", deptNo: "21", deptName: "Côte-d'Or" },
  { placeName: "Bordeaux", deptNo: "33", deptName: "Gironde" },
  { placeName: "Grenoble", deptNo: "38", deptName: "Isère" },
  { placeName: "Toulouse", deptNo: "31", deptName: "Haute-Garonne" },
  { placeName: "Rennes", deptNo: "35", deptName: "Ille-et-Vilaine" },
  { placeName: "Marseille", deptNo: "13", deptName: "Bouches-du-Rhône" },
];

interface Props {
  mobile?: boolean;
}

const LocationMenu: React.FC<Props> = ({ mobile = false }) => {
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const searchResults = useSelector(searchResultsSelector);
  const pagination = useSelector(searchPaginationSelector);
  const eventName = useSearchEventName();
  const announce = useAnnounce();
  const { t } = useTranslation();

  const [locationSearch, setLocationSearch] = useState("");
  const [suggestions, setSuggestions] = useState<UnifiedSearchResult[]>([]);
  const [pendingAnnounce, setPendingAnnounce] = useState(false);
  const previousMatchesRef = useRef(searchResults.matches);

  // Helper function to decode location names consistently
  const decodeLocation = useCallback((value: string): string => {
    if (!value) return "";
    let decoded = value;
    try {
      decoded = decodeURIComponent(value);
    } catch (e) {
      decoded = value;
    }
    return decoded
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
  }, []);

  // Helper function to normalize location names for comparison
  const getNormalizedLocations = useCallback(
    (locations: string[]): string[] => {
      const seen = new Set<string>();
      const normalized: string[] = [];

      locations.forEach((loc) => {
        const decoded = decodeLocation(loc);
        if (!seen.has(decoded)) {
          seen.add(decoded);
          normalized.push(decoded);
        }
      });

      return normalized;
    },
    [decodeLocation],
  );

  const NOT_DEPLOYED_THRESHOLD = 10;

  const fetchSuggestions = useCallback(async (search: string): Promise<UnifiedSearchResult[]> => {
    const apiSearchQuery = search.replace(/ /g, "%20");

    const [municipalityData, departmentData] = await Promise.all([
      fetch(
        `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(search)}&type=municipality`,
      )
        .then((response) => response.json())
        .catch(() => ({ features: [] })),
      fetch(`https://geo.api.gouv.fr/departements?nom=${apiSearchQuery}`)
        .then((response) => response.json())
        .catch(() => []),
    ]);

    const municipalityResults = (municipalityData.features || []).map(transformMunicipalityResult);
    const departmentResults = (departmentData || []).map(transformDepartmentResult);
    const allResults = [...municipalityResults, ...departmentResults];
    const sortedResults = sortByRelevance(allResults, search);

    return sortedResults.slice(0, 5);
  }, []);

  const announceResults = useCallback(
    (count: number, options?: ScreenReaderAnnounceOptions) => {
      const announceOptions: ScreenReaderAnnounceOptions = {
        delay: 1500,
        ...(options ?? {}),
      };

      announce(
        t("Recherche.citySelectionsResults", {
          count,
        }),
        announceOptions,
      );
    },
    [announce, t],
  );

  const handleSearchChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      setLocationSearch(search);

      if (search.length <= 2) {
        setSuggestions([]);
        announceResults(0);
        return;
      }

      try {
        const results = await fetchSuggestions(search);
        setSuggestions(results);
        announceResults(results.length);
      } catch (error) {
        setSuggestions([]);
        announceResults(0);
      }
    },
    [announceResults, fetchSuggestions],
  );

  const debouncedSearchChange = useMemo(
    () => debounce(handleSearchChange, 500),
    [handleSearchChange],
  );

  // Use the existing decodeLocation function for consistency

  const toggleSelection = useCallback(
    async (location: string, isCity: boolean) => {
      setPendingAnnounce(true);
      const normalizedLocation = decodeLocation(location);

      if (isCity) {
        // Handle city selection/deselection
        const currentCities = query.cities || [];
        const cityExists = currentCities.some(
          (city) => decodeLocation(city) === normalizedLocation,
        );
        const updatedCities = cityExists
          ? currentCities.filter((city) => decodeLocation(city) !== normalizedLocation)
          : [...currentCities, normalizedLocation];

        // Get the department for this city
        const department = await getDepartmentForCity(normalizedLocation);

        // If adding a city, ensure its department is in the departments list
        let updatedDepartments = query.departments || [];
        if (!cityExists && department) {
          const deptExists = updatedDepartments.some(
            (dept: string) => decodeLocation(dept) === department,
          );
          if (!deptExists) {
            updatedDepartments = [...updatedDepartments, department];
          }
        }
        // Note: We don't remove the department when deselecting a city (requirement #2)

        dispatch(
          addToQueryActionCreator({
            cities: getNormalizedLocations(updatedCities),
            departments: getNormalizedLocations(updatedDepartments),
            sort: "location",
          }),
        );
      } else {
        // Handle department selection/deselection
        const currentDepartments = query.departments || [];
        const deptExists = currentDepartments.some(
          (dept: string) => decodeLocation(dept) === normalizedLocation,
        );

        if (deptExists) {
          // When removing a department, also remove all its cities
          const updatedDepartments = currentDepartments.filter(
            (dept: string) => decodeLocation(dept) !== normalizedLocation,
          );

          // Get all cities that belong to this department
          const citiesToRemove = await getCitiesForDepartment(location);
          const currentCities = query.cities || [];
          const updatedCities = currentCities.filter(
            (city: string) => !citiesToRemove.includes(decodeLocation(city)),
          );

          dispatch(
            addToQueryActionCreator({
              departments: getNormalizedLocations(updatedDepartments),
              cities: getNormalizedLocations(updatedCities),
              sort: "location",
            }),
          );

          // Announce when clearing last department
          if (updatedDepartments.length === 0) {
            announce(t("Recherche.departmentsCleared", "Filtre de localisation effacé"), {
              delay: 500,
            });
          }
        } else {
          // When adding a department
          const updatedDepartments = [...currentDepartments, normalizedLocation];
          dispatch(
            addToQueryActionCreator({
              departments: getNormalizedLocations(updatedDepartments),
              sort: "location",
            }),
          );
        }
      }
    },
    [
      dispatch,
      query.departments,
      query.cities,
      decodeLocation,
      getNormalizedLocations,
      announce,
      t,
    ],
  );

  const handleResultToggle = useCallback(
    (result: UnifiedSearchResult) => {
      Event(eventName, "toggle location option", result.label);
      Event(eventName, "click filter", "location");
      // Pass true for cities, false for departments
      toggleSelection(
        result.type === "department" ? result.deptName : result.displayName,
        result.type === "city",
      );
    },
    [toggleSelection, eventName],
  );

  const handleCommonPlaceSelect = useCallback(
    (deptName: string, placeName?: string) => {
      Event(eventName, "choose location suggestion", deptName);
      toggleSelection(
        placeName || deptName,
        !!placeName, // true if placeName exists (city), false otherwise (department)
      );
    },
    [eventName, toggleSelection],
  );

  useEffect(() => {
    if (!pendingAnnounce) {
      previousMatchesRef.current = searchResults.matches;
      return;
    }

    const hasNewResults = previousMatchesRef.current !== searchResults.matches;
    if (!hasNewResults) return;

    previousMatchesRef.current = searchResults.matches;

    const currentDepartments = query.departments || [];
    const currentCities = query.cities || [];

    announce(
      t("Recherche.loadedSheets", "{{count}} fiches chargées", {
        count: searchResults.matches.length,
      }),
      {
        delay: 1000,
      },
    );

    // Warn about underserved departments using pagination total as proxy
    if (pagination.total < NOT_DEPLOYED_THRESHOLD && currentDepartments.length > 0) {
      currentDepartments.forEach((dept) => {
        announce(
          t(
            "Recherche.notDeployedText",
            "Le référencement des actions locales débute dans le département – {{department}}. Votre recherche peut aboutir à peu de résultats.",
            {
              department: decodeLocation(dept),
              interpolation: { escapeValue: false },
            },
          ),
        );
      });
    }
    setPendingAnnounce(false);
  }, [
    pendingAnnounce,
    query.departments,
    query.cities,
    pagination.total,
    announce,
    t,
    decodeLocation,
    searchResults.matches,
  ]);

  const renderSuggestions = () => (
    <Checkbox
      legend="Résultats de recherche"
      className="w-full"
      options={suggestions.map((result) => {
        const typeLabel = result.type === "department" ? " (Département)" : "";

        let isChecked = false;
        if (result.type === "department") {
          isChecked =
            query.departments?.some(
              (dept) => decodeLocation(dept) === decodeLocation(result.deptName),
            ) || false;
        } else {
          isChecked =
            query.cities?.some(
              (city) => decodeLocation(city) === decodeLocation(result.displayName),
            ) || false;
        }

        return {
          label: `${result.displayName} (${result.deptCode})${typeLabel}`,
          nativeInputProps: {
            checked: isChecked,
            onChange: () => handleResultToggle(result),
          },
        };
      })}
    />
  );

  const renderCommonPlaces = () => {
    const selectedCities = query.cities || [];
    const options = commonPlaces.map(({ deptNo, placeName, deptName }) => {
      const decodedCityName = decodeLocation(placeName);
      const isChecked = selectedCities.some((city) => decodeLocation(city) === decodedCityName);

      return {
        label: `${placeName} (${deptNo})`,
        nativeInputProps: {
          checked: isChecked,
          onChange: () => handleCommonPlaceSelect(deptName, placeName),
        },
      };
    });

    if (options.length === 0) {
      return null;
    }

    return (
      <Checkbox
        className="w-full"
        legend={t("Recherche.commonPlaces", "Villes courantes")}
        options={options}
      />
    );
  };

  const renderSelectedLocations = () => {
    const selectedDepartments = (query?.departments || []).map((dept: string) => ({
      label: `${decodeLocation(dept)} (${t("Recherche.department", "Département")})`,
      nativeInputProps: {
        name: `department-${dept}`,
        checked: true,
        onChange: () => toggleSelection(dept, false),
      },
    }));

    const selectedCities = (query?.cities || []).map((city: string) => ({
      label: `${decodeLocation(city)} (${t("Recherche.city", "Ville")})`,
      nativeInputProps: {
        name: `city-${city}`,
        checked: true,
        onChange: () => toggleSelection(city, true),
      },
    }));

    const selectedLocations = [...selectedDepartments, ...selectedCities];

    if (selectedLocations.length === 0) {
      return null;
    }

    return (
      <>
        <Checkbox
          legend={t("Recherche.selectedLocations", "Localisations sélectionnées")}
          className="border-default-grey !mb-0 w-full"
          options={selectedLocations}
        />
      </>
    );
  };

  return (
    <div className={cn(styles.container)}>
      <GeoLocationMenuItem />
      <SearchMenuItem onChange={debouncedSearchChange} />

      <div className={styles.places}>
        {locationSearch !== "" && renderSuggestions()}
        {renderSelectedLocations()}
        {locationSearch === "" && renderCommonPlaces()}
      </div>
    </div>
  );
};

export default LocationMenu;
