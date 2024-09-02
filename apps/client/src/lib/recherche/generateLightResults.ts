import { GetDispositifsResponse } from "@refugies-info/api-types";
import { MAX_SHOWN_DISPOSITIFS } from "~/components/Pages/recherche/SearchResults/SearchResults";
import { Results } from "~/services/SearchResults/searchResults.reducer";

const getSearchDispositifs = (dispositifs: GetDispositifsResponse[], max: number): GetDispositifsResponse[] => {
  //@ts-ignore - see comment below
  return [
    ...dispositifs.slice(0, max),
    /* TS does not accept ids instead of SearchDispositifs.
    We force it to have a lighter payload.
    The front will recalculate the results on loading anyway */
    ...dispositifs.slice(max, dispositifs.length).map((d) => d._id),
  ];
};

/**
 * Keep only the informations of the visible results, to lighten the payload
 * @param results - real results
 * @param homeVisible - is home shown or not
 * @returns - results lighter
 */
export const generateLightResults = (results: Results) => {
  const lightResults: Results = {
    matches: getSearchDispositifs(results.matches, MAX_SHOWN_DISPOSITIFS),
    suggestions: getSearchDispositifs(results.suggestions, MAX_SHOWN_DISPOSITIFS),
  };

  return lightResults;
};
