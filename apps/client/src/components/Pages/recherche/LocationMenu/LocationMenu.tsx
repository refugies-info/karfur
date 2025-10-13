import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { useSearchEventName } from "~/hooks";
import { getDepartmentNameFromCode } from "~/lib/departments";
import { filterByType } from "~/lib/recherche/filterContents";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector, searchResultsSelector } from "~/services/SearchResults/searchResults.selector";
import { getPlaceName } from "./functions";
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

  const [locationSearch, setLocationSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [pendingAnnounce, setPendingAnnounce] = useState(false);
  const [previousDepartment, setPreviousDepartment] = useState<string>("");
  const [previousResultsCount, setPreviousResultsCount] = useState<number>(0);

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
        fetch(`https://data.geopf.fr/geocodage/search?q=${search}&type=municipality`)
          .then((response) => response.json())
          .then((data) => {
            if (data.features) {
              setSuggestions(data.features);
              announce(
                t("Recherche.citySelectionsResults", {
                  count: data.features.length,
                }),
                { delay: 1000, priority: "interrupt" },
              );
            }
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
    (place: any) => {
      Event(eventName, "choose location option", place.properties.label);
      Event(eventName, "click filter", "location");
      const contextParts = place.properties.context.split(", ");

      setPreviousResultsCount(filteredResults.matches.length);
      setPendingAnnounce(true);

      if (contextParts.length > 1) {
        const depName = contextParts[1];
        dispatch(
          addToQueryActionCreator({
            departments: [depName],
            sort: "location",
          }),
        );
      }
    },
    [dispatch, eventName, filteredResults.matches.length],
  );

  const onSelectCommonPlace = useCallback(
    (depName: string) => {
      Event(eventName, "choose location suggestion", depName);
      setPreviousResultsCount(filteredResults.matches.length);
      setPendingAnnounce(true);

      dispatch(
        addToQueryActionCreator({
          departments: [depName],
          sort: "location",
        }),
      );
    },
    [dispatch, eventName, filteredResults.matches.length],
  );

  useEffect(() => {
    const currentDepartment = query.departments[0] || "";
    if (pendingAnnounce && currentDepartment && currentDepartment !== previousDepartment) {
      setPreviousDepartment(currentDepartment);
    }
  }, [query.departments, pendingAnnounce, previousDepartment]);

  useEffect(() => {
    if (!pendingAnnounce) return undefined;

    const currentDepartment = query.departments[0] || "";
    const currentCount = filteredResults.matches.length;

    if (currentDepartment && currentCount > 0 && currentCount !== previousResultsCount) {
      const decodedDept = decodeURIComponent(currentDepartment);
      const message = t("Recherche.selectDepartement", "Département {{dept}} sélectionné {{count}} fiches chargées", {
        dept: decodedDept,
        count: currentCount,
      });
      const parser = new DOMParser();
      const decodedMessage = parser.parseFromString(message, "text/html").documentElement.textContent || message;
      announce(decodedMessage, {
        delay: 1000,
        priority: "interrupt",
      });

      setPreviousResultsCount(currentCount);
      setPendingAnnounce(false);
    }
    return undefined;
  }, [filteredResults.matches.length, announce, t, query.departments, pendingAnnounce, previousResultsCount]);

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
            options={suggestions.slice(0, 5).map((p, i) => {
              const placeName = getPlaceName(p);
              const deptNo = p.properties.context.split(",")[0];
              const isChecked = p.properties.context.includes(query.departments[0]);

              return {
                label: `${placeName} ${deptNo}`,
                nativeInputProps: {
                  checked: isChecked,
                  onChange: () => onSelectPrediction(p),
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
