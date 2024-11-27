import { Id, SimpleDispositif } from "@refugies-info/api-types";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocale } from "~/hooks";
import { filterDispositifs, queryAlgolia } from "~/lib/recherche/queryContents";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";

/**
 * Custom hook that manages the counting of dispositifs by theme and need.
 * The hook handles:
 * 1. Text search through Algolia
 * 2. Filtering of results based on query parameters
 * 3. Counting of filtered dispositifs by theme and need
 *
 * The counting process ensures that:
 * - Only active dispositifs are counted
 * - Only needs that belong to the same theme as the dispositif are counted
 * - Dispositifs without a theme are excluded
 *
 * @param isOpen - Whether the theme menu is open. Controls when searches and updates occur
 * @returns An object containing:
 *  - nbDispositifsByTheme: Count of dispositifs per theme
 *  - nbDispositifsByNeed: Count of dispositifs per need (filtered by theme)
 */
export const useDispositifCounts = (isOpen: boolean) => {
  const query = useSelector(searchQuerySelector);
  const dispositifs = useSelector(activeDispositifsSelector);
  const allNeeds = useSelector(needsSelector);
  const locale = useLocale();

  const [searchResults, setSearchResults] = useState<SimpleDispositif[]>(dispositifs);
  const [filteredDispositifs, setFilteredDispositifs] = useState<SimpleDispositif[]>([]);

  // Create a map of need ID to theme ID for efficient lookups
  const needsToThemeMap = useMemo(
    () => allNeeds.reduce<Map<Id, Id>>((map, need) => map.set(need._id, need.theme._id), new Map()),
    [allNeeds],
  );

  // Step 1: Handle text search through Algolia
  useEffect(() => {
    const performSearch = async () => {
      setSearchResults(query.search !== "" ? await queryAlgolia(query.search, dispositifs, locale) : dispositifs);
    };
    if (isOpen) performSearch();
  }, [query.search, dispositifs, locale, isOpen]);

  // Step 2: Apply filters to search results
  useEffect(() => {
    if (!isOpen) return;
    const filtered = filterDispositifs(query, searchResults, false, "theme");
    setFilteredDispositifs(filtered);
  }, [query, searchResults, allNeeds, isOpen]);

  // Step 3: Count dispositifs by theme
  const nbDispositifsByTheme = _(filteredDispositifs)
    .filter((dispositif) => dispositif.theme !== null)
    .countBy((dispositif) => dispositif.theme?.toString())
    .value();

  // Step 4: Count dispositifs by need, ensuring needs match the dispositif's theme
  const nbDispositifsByNeed = _(filteredDispositifs)
    .filter((dispositif) => dispositif.theme !== null)
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
