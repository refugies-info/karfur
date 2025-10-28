import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { useSearchEventName } from "~/hooks";
import { getDepartmentNameFromCode } from "~/lib/departments";
import { filterByType } from "~/lib/recherche/filterContents";
import { getCountDispositifsForDepartment, getDepartmentsNotDeployed } from "~/lib/recherche/functions";
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
  const eventName = useSearchEventName();
  const announce = useAnnounce();
  const { t } = useTranslation();
  const searchResults = useSelector(searchResultsSelector);
  const dispositifs = useSelector(activeDispositifsSelector);

  const [locationSearch, setLocationSearch] = useState("");
  const [suggestions, setSuggestions] = useState<UnifiedSearchResult[]>([]);
  const [pendingAnnounce, setPendingAnnounce] = useState(false);
  const [lastAnnouncedDepartment, setLastAnnouncedDepartment] = useState<string>("");
  const [lastAnnouncedCount, setLastAnnouncedCount] = useState<number>(-1);
  const [departmentsNotDeployed, setDepartmentsNotDeployed] = useState<string[]>(
    getDepartmentsNotDeployed(query.departments, dispositifs ?? []),
  );

  const filteredResults = useMemo(() => {
    return {
      matches: searchResults.matches.filter((dispositif) => filterByType(dispositif, query.type)),
      suggestions: searchResults.suggestions,
    };
  }, [query.type, searchResults]);

  const onChangeDepartmentInput = useCallback(
    (e: any) => {
      const search = e.target.value;
      setLocationSearch(search);
      if (search.length > 2) {
        // Helper function to normalize string (same as in functions.ts)
        const normalizeString = (str: string) =>
          str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s-]+/g, " ")
            .trim();

        // For department API, use normalized query to handle accent and hyphen issues
        const normalizedSearch = normalizeString(search);
        // Convert spaces back to %20 for URL encoding (not to hyphens)
        const apiSearchQuery = normalizedSearch.replace(/ /g, "%20");

        // Parallel API calls to both municipality and department APIs
        Promise.all([
          fetch(`https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(search)}&type=municipality`)
            .then((response) => response.json())
            .catch(() => ({ features: [] })),
          // Try normalized search for departments to handle accent and hyphen issues
          fetch(`https://geo.api.gouv.fr/departements?nom=${apiSearchQuery}`)
            .then((response) => response.json())
            .catch(() => []),
        ])
          .then(([municipalityData, departmentData]) => {
            // Transform municipality results
            const municipalityResults = (municipalityData.features || []).map(transformMunicipalityResult);

            // Transform department results
            const departmentResults = (departmentData || []).map(transformDepartmentResult);

            // Merge and sort results
            const allResults = [...municipalityResults, ...departmentResults];
            const sortedResults = sortByRelevance(allResults, search);
            const limitedResults = sortedResults.slice(0, 5);

            setSuggestions(limitedResults);
            announce(
              t("Recherche.citySelectionsResults", {
                count: limitedResults.length,
              }),
              { delay: 1000, priority: "interrupt" },
            );
          })
          .catch((error) => {
            setSuggestions([]);
            announce(
              t("Recherche.citySelectionsResults", {
                count: 0,
              }),
              { delay: 1000, priority: "interrupt" },
            );
          });
      } else {
        announce(
          t("Recherche.citySelectionsResults", {
            count: 0,
          }),
          {
            delay: 1000,
            priority: "interrupt",
          },
        );
        setSuggestions([]);
      }
    },
    [setLocationSearch, announce, t],
  );

  const debouncedOnChangeDepartmentInput = useMemo(
    () => debounce(onChangeDepartmentInput, 500),
    [onChangeDepartmentInput],
  );

  const onSelectPrediction = useCallback(
    (result: UnifiedSearchResult) => {
      Event(eventName, "choose location option", result.label);
      Event(eventName, "click filter", "location");

      setPendingAnnounce(true);

      dispatch(
        addToQueryActionCreator({
          departments: [result.deptName],
          sort: "location",
        }),
      );
    },
    [dispatch, eventName],
  );

  const onSelectCommonPlace = useCallback(
    (depName: string) => {
      Event(eventName, "choose location suggestion", depName);
      setPendingAnnounce(true);

      dispatch(
        addToQueryActionCreator({
          departments: [depName],
          sort: "location",
        }),
      );
    },
    [dispatch, eventName],
  );

  useEffect(() => {
    setDepartmentsNotDeployed(getDepartmentsNotDeployed(query.departments, dispositifs ?? []));
  }, [query.departments, dispositifs]);

  // Vocalization effect - announces department selection and results
  useEffect(() => {
    if (!pendingAnnounce) return;

    const currentDepartment = query.departments[0] || "";
    // Get the actual count of dispositifs for the selected department
    const currentCount = currentDepartment ? getCountDispositifsForDepartment(currentDepartment, dispositifs ?? []) : 0;

    // Skip if we've already announced this exact state
    if (currentDepartment === lastAnnouncedDepartment && currentCount === lastAnnouncedCount) {
      setPendingAnnounce(false);
      return;
    }

    if (!currentDepartment) {
      setPendingAnnounce(false);
      return;
    }

    const decodedDept = decodeURIComponent(currentDepartment);
    // Check if department is not deployed (< 10 dispositifs)
    const isNotDeployed = currentCount < 10;

    // Announce not deployed status
    if (isNotDeployed) {
      const message = t("Recherche.notDeployedText", {
        department: decodedDept,
      });
      announce(message, {
        delay: 1000,
        priority: "interrupt",
      });
    }
    // Announce results count for deployed departments
    else if (currentCount > 0) {
      const message = t("Recherche.selectDepartement", "Département {{dept}} sélectionné {{count}} fiches chargées", {
        dept: decodedDept,
        count: currentCount,
      });
      announce(message, {
        delay: 1000,
        priority: "interrupt",
      });
    }

    // Update tracking state
    setLastAnnouncedDepartment(currentDepartment);
    setLastAnnouncedCount(currentCount);
    setPendingAnnounce(false);
  }, [
    pendingAnnounce,
    query.departments,
    dispositifs,
    departmentsNotDeployed,
    lastAnnouncedDepartment,
    lastAnnouncedCount,
    announce,
    t,
  ]);

  return (
    <div className={styles.container}>
      <GeoLocationMenuItem />
      <SearchMenuItem onChange={debouncedOnChangeDepartmentInput} />

      <div className={styles.places}>
        {locationSearch !== "" && (
          <RadioButtons
            name="radio"
            legend="Résultats de recherche"
            className="[&_legend]:sr-only"
            options={suggestions.slice(0, 5).map((result) => {
              const isChecked = result.deptName === query.departments[0];
              const typeLabel = result.type === "department" ? " (Département)" : "";

              return {
                label: `${result.displayName} (${result.deptCode})${typeLabel}`,
                nativeInputProps: {
                  checked: isChecked,
                  onChange: () => onSelectPrediction(result),
                },
              };
            })}
          />
        )}
        {locationSearch === "" && (
          <RadioButtons
            name="radio"
            legend="Villes courantes"
            className="[&_legend]:sr-only"
            options={commonPlaces.map(({ deptNo, placeName, deptName }) => {
              const isChecked = query?.departments[0] === deptName;

              return {
                label: `${placeName} ${deptNo}`,
                nativeInputProps: {
                  checked: isChecked,
                  onChange: () => onSelectCommonPlace(getDepartmentNameFromCode(deptNo)),
                },
              };
            })}
          />
        )}
      </div>
    </div>
  );
};

export default LocationMenu;
