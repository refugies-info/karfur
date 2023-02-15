import { GetDispositifsResponse } from "api-types";
import { HOME_MAX_SHOWN_DEMARCHES, HOME_MAX_SHOWN_DISPOSITIFS } from "components/Pages/recherche/HomeSearch/HomeSearch";
import { MAX_SHOWN_DEMARCHES, MAX_SHOWN_DISPOSITIFS } from "components/Pages/recherche/SearchResults/SearchResults";
import { Results } from "services/SearchResults/searchResults.reducer";

const getSearchDispositifs = (dispositifs: GetDispositifsResponse[], max: number): GetDispositifsResponse[] => {
  //@ts-ignore - see comment below
  return [
    ...dispositifs.slice(0, max),
    /* TS does not accept ids instead of SearchDispositifs.
    We force it to have a lighter payload.
    The front will recalculate the results on loading anyway */
    ...dispositifs.slice(max, dispositifs.length).map(d => d._id),
  ];
}

/**
 * Keep only the informations of the visible results, to lighten the payload
 * @param results - real results
 * @param homeVisible - is home shown or not
 * @returns - results lighter
 */
export const generateLightResults = (results: Results, homeVisible: boolean) => {
  const lightResults: Results = {
    dispositifs: getSearchDispositifs(results.dispositifs, homeVisible ? HOME_MAX_SHOWN_DISPOSITIFS : MAX_SHOWN_DISPOSITIFS),
    demarches: getSearchDispositifs(results.demarches, homeVisible ? HOME_MAX_SHOWN_DEMARCHES : MAX_SHOWN_DEMARCHES),
    dispositifsSecondaryTheme: getSearchDispositifs(results.dispositifsSecondaryTheme, homeVisible ? 0 : MAX_SHOWN_DISPOSITIFS)
  };

  return lightResults;
}
