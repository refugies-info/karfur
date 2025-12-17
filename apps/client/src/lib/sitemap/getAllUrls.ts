import { ContentType, type GetActiveStructuresResponse, type Id } from "@refugies-info/api-types";
import { getPath, type PathNames } from "routes";
import API from "~/utils/API";

const SITE_URL = process.env.NEXT_PUBLIC_REACT_APP_SITE_URL;
const PATHS_CRAWL: PathNames[] = [
  "/",
  "/recherche",
  "/publier",
  "/mission-et-impact",
  "/mentions-legales",
  "/declaration-accessibilite",
  "/politique-de-confidentialite",
];

const getUrl = (path: PathNames, locale: string, id?: Id) => {
  const url = path === "/" ? "" : getPath(path, locale); // for / path, return empty to avoid trailing slash
  const translatedUrl = id ? url.replace("[id]", id.toString()) : url;
  return `${SITE_URL}/${locale}${translatedUrl}`;
};

export const getAllUrls = async (type: string, locale: string): Promise<string[]> => {
  switch (type) {
    // DISPOSITIFS
    case "dispositifs": {
      const dispositifs = await API.getDispositifs({
        type: ContentType.DISPOSITIF,
        locale: locale,
      });
      return dispositifs.map((d) => getUrl("/dispositif/[id]", locale, d._id));
    }

    // DEMARCHES
    case "demarches": {
      const demarches = await API.getDispositifs({
        type: ContentType.DEMARCHE,
        locale: locale,
      });
      return demarches.map((d) => getUrl("/demarche/[id]", locale, d._id));
    }

    // PAGES
    case "pages":
      return PATHS_CRAWL.map((p: PathNames) => getUrl(p, locale));

    default:
      return [];
  }
};
