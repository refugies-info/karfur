import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { useSearchEventName } from "~/hooks";
import { getCountDispositifsForDepartment } from "~/lib/recherche/functions";
import { Event } from "~/lib/tracking";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector, searchResultsSelector } from "~/services/SearchResults/searchResults.selector";
import {
  sortByRelevance,
  transformDepartmentResult,
  transformMunicipalityResult,
  UnifiedSearchResult,
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

const LocationMenu: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const searchResults = useSelector(searchResultsSelector);
  const dispositifs = useSelector(activeDispositifsSelector);
  const eventName = useSearchEventName();
  const announce = useAnnounce();
  const { t } = useTranslation();

  const [locationSearch, setLocationSearch] = useState("");
  const [suggestions, setSuggestions] = useState<UnifiedSearchResult[]>([]);
  const [pendingAnnounce, setPendingAnnounce] = useState(false);
  const previousMatchesRef = useRef(searchResults.matches);

  const decodeDepartment = useCallback((value: string) => {
    let decoded = value;
    try {
      decoded = decodeURIComponent(value);
    } catch (error) {
      decoded = value;
    }
    return decoded
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&");
  }, []);

  const getNormalizedDepartments = useCallback(
    (departments: string[]) => {
      const seen = new Set<string>();
      const normalized: string[] = [];

      departments.forEach((dept) => {
        const decoded = decodeDepartment(dept);
        if (!seen.has(decoded)) {
          seen.add(decoded);
          normalized.push(decoded);
        }
      });

      return normalized;
    },
    [decodeDepartment],
  );

  const departmentCounts = useMemo(() => dispositifs ?? [], [dispositifs]);

  const fetchSuggestions = useCallback(async (search: string): Promise<UnifiedSearchResult[]> => {
    const normalizeString = (str: string) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s-]+/g, " ")
        .trim();

    const normalizedSearch = normalizeString(search);
    const apiSearchQuery = normalizedSearch.replace(/ /g, "%20");

    const [municipalityData, departmentData] = await Promise.all([
      fetch(`https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(search)}&type=municipality`)
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
        delay: 1000,
        priority: "interrupt",
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

  const debouncedSearchChange = useMemo(() => debounce(handleSearchChange, 500), [handleSearchChange]);

  const toggleDepartmentSelection = useCallback(
    (deptName: string) => {
      setPendingAnnounce(true);

      const normalizedTarget = decodeDepartment(deptName);
      const currentDepartments = query.departments || [];
      const hasDepartment = currentDepartments.some((dept) => decodeDepartment(dept) === normalizedTarget);

      const updatedDepartments = hasDepartment
        ? currentDepartments.filter((dept) => decodeDepartment(dept) !== normalizedTarget)
        : [...currentDepartments, normalizedTarget];

      // Announce when clearing last department
      if (hasDepartment && updatedDepartments.length === 0) {
        announce(t("Recherche.departmentsCleared", "Filtre de localité effacé"));
      }

      dispatch(
        addToQueryActionCreator({
          departments: getNormalizedDepartments(updatedDepartments),
          sort: "location",
        }),
      );
    },
    [dispatch, query.departments, decodeDepartment, getNormalizedDepartments, announce, t],
  );
  const handleResultToggle = useCallback(
    (result: UnifiedSearchResult) => {
      Event(eventName, "toggle location option", result.label);
      Event(eventName, "click filter", "location");
      toggleDepartmentSelection(result.deptName);
    },
    [eventName, toggleDepartmentSelection],
  );

  const handleCommonPlaceSelect = useCallback(
    (deptName: string) => {
      Event(eventName, "choose location suggestion", deptName);
      toggleDepartmentSelection(deptName);
    },
    [eventName, toggleDepartmentSelection],
  );

  const resultsCount = searchResults.matches.length;

  useEffect(() => {
    if (!pendingAnnounce) {
      previousMatchesRef.current = searchResults.matches;
      return;
    }

    const hasNewResults = previousMatchesRef.current !== searchResults.matches;
    if (!hasNewResults) return;

    previousMatchesRef.current = searchResults.matches;

    const currentDepartments = query.departments || [];
    const totalCount = searchResults.matches.length;

    const departmentNames = currentDepartments.map((dept) => decodeDepartment(dept)).join(", ");
    announce(
      t("Recherche.selectDepartement", "Département {{dept}} sélectionné {{count}} fiches chargées", {
        dept: departmentNames,
        count: totalCount,
        interpolation: { escapeValue: false },
      }),
      { delay: 1000, priority: "interrupt" },
    );

    currentDepartments.forEach((dept) => {
      const count = getCountDispositifsForDepartment(dept, departmentCounts);
      if (count < 10) {
        announce(
          t(
            "Recherche.notDeployedText",
            "Le référencement des actions locales débute dans le département – {{department}}. Votre recherche peut aboutir à peu de résultats.",
            {
              department: decodeDepartment(dept),
              interpolation: { escapeValue: false },
            },
          ),
          { delay: 1000, priority: "interrupt" },
        );
      }
    });
    setPendingAnnounce(false);
  }, [pendingAnnounce, query.departments, departmentCounts, announce, t, decodeDepartment, searchResults.matches]);

  const renderSuggestions = () => (
    <Checkbox
      legend="Résultats de recherche"
      className="[&_legend]:sr-only"
      options={suggestions.map((result) => {
        const isChecked =
          query.departments?.some((dept) => decodeDepartment(dept) === decodeDepartment(result.deptName)) || false;
        const typeLabel = result.type === "department" ? " (Département)" : "";

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

  const renderCommonPlaces = () => (
    <Checkbox
      legend="Villes courantes"
      className="[&_legend]:sr-only"
      options={commonPlaces.map(({ deptNo, placeName, deptName }) => {
        const decodedDeptName = decodeDepartment(deptName);
        const isChecked = query.departments?.some((dept) => decodeDepartment(dept) === decodedDeptName) || false;

        return {
          label: `${placeName} ${deptNo}`,
          nativeInputProps: {
            checked: isChecked,
            onChange: () => handleCommonPlaceSelect(deptName),
          },
        };
      })}
    />
  );

  return (
    <div className={styles.container}>
      <GeoLocationMenuItem />
      <SearchMenuItem onChange={debouncedSearchChange} />

      <div className={styles.places}>
        {locationSearch !== "" && renderSuggestions()}
        {locationSearch === "" && renderCommonPlaces()}
      </div>
    </div>
  );
};

export default LocationMenu;
