import { GetActiveStructuresResponse, Id } from "api-types";
import { getPath, PathNames } from "routes";
import { Structure } from "types/interface";
import API from "utils/API";

const SITE_URL = process.env.NEXT_PUBLIC_REACT_APP_SITE_URL;
const PATHS_CRAWL: PathNames[] = [
  "/",
  "/recherche",
  "/annuaire",
  "/publier",
  "/qui-sommes-nous",
  "/mentions-legales",
  "/declaration-accessibilite",
  "/politique-de-confidentialite"
];

const getUrl = (path: PathNames, locale: string, id?: Id) => {
  const url = path === "/" ? "" : getPath(path, locale); // for / path, return empty to avoid trailing slash
  const translatedUrl = id ? url.replace("[id]", id.toString()) : url;
  return `${SITE_URL}/${locale}${translatedUrl}`;
}

export const getAllUrls = async (type: string, locale: string): Promise<string[]> => {
  switch (type) {

    // DISPOSITIFS
    case "dispositifs":
      const dispositifs = await API.getDispositifs({
        type: "dispositif",
        locale: locale
      });
      return dispositifs.data.data
        .map((d) => getUrl("/dispositif/[id]", locale, d._id));

    // DEMARCHES
    case "demarches":
      const demarches = await API.getDispositifs({
        type: "demarche",
        locale: locale
      });
      return demarches.data.data
        .map((d) => getUrl("/demarche/[id]", locale, d._id));

    // STRUCTURES
    case "structures":
      const structures = await API.getActiveStructures();
      return structures.data.data
        .map((s: GetActiveStructuresResponse) => getUrl("/annuaire/[id]", locale, s._id));

    // PAGES
    case "pages":
      return PATHS_CRAWL.map((p: PathNames) => getUrl(p, locale));

    default:
      return [];
  }
}
