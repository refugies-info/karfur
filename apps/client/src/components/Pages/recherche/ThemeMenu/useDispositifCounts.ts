import { Id, SimpleDispositif } from "@refugies-info/api-types";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocale } from "~/hooks";
import { filterDispositifs, queryAlgolia } from "~/lib/recherche/queryContents";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";

export const useDispositifCounts = (isOpen: boolean) => {
  const query = useSelector(searchQuerySelector);
  const dispositifs = useSelector(activeDispositifsSelector);
  const allNeeds = useSelector(needsSelector);
  const locale = useLocale();

  const [searchResults, setSearchResults] = useState<SimpleDispositif[]>(dispositifs);
  const [filteredDispositifs, setFilteredDispositifs] = useState<SimpleDispositif[]>([]);
  const needsToThemeMap = useMemo(
    () => allNeeds.reduce<Map<Id, Id>>((map, need) => map.set(need._id, need.theme._id), new Map()),
    [allNeeds],
  );

  // Handle Algolia search
  useEffect(() => {
    const performSearch = async () => {
      setSearchResults(query.search !== "" ? await queryAlgolia(query.search, dispositifs, locale) : dispositifs);
    };
    if (isOpen) performSearch();
  }, [query.search, dispositifs, locale, isOpen]);

  // Handle filtering
  useEffect(() => {
    if (!isOpen) return;
    const filtered = filterDispositifs(query, searchResults, false, "theme");
    setFilteredDispositifs(filtered);
  }, [query, searchResults, allNeeds, isOpen]);

  const nbDispositifsByTheme = _(filteredDispositifs)
    .filter((dispositif) => dispositif.theme !== null && dispositif.status === "Actif")
    .countBy((dispositif) => dispositif.theme?.toString())
    .value();

  const nbDispositifsByNeed = _(filteredDispositifs)
    .filter((dispositif) => dispositif.theme !== null && dispositif.status === "Actif")
    .flatMap((dispositif) =>
      _(dispositif.needs)
        .filter((id) => {
          return needsToThemeMap.get(id) === dispositif.theme;
        })
        .value(),
    )
    .countBy()
    .value();

  return {
    nbDispositifsByTheme,
    nbDispositifsByNeed,
  };
};
