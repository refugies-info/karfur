import type { Poi } from "@refugies-info/api-types";
import { normalizeString } from "~/lib/string";

const POSTCODE_AND_CITY_REGEX = /\b\d{5}\s+\p{L}/u;
const TRAILING_COUNTRY_REGEX = /,\s*France\s*$/i;

export const getPoiLocationText = (poi?: Poi): string => {
  const address = poi?.address?.replace(TRAILING_COUNTRY_REGEX, "").trim();
  if (!address) return poi?.city ?? "";
  if (
    poi?.city &&
    !POSTCODE_AND_CITY_REGEX.test(address) &&
    !address.toLowerCase().includes(poi.city.toLowerCase())
  ) {
    return `${address}, ${poi.city}`;
  }
  return address;
};

export const getPoiDistinctTitle = (
  poi: Poi | undefined,
  structureName: string | undefined,
): string | null => {
  if (!poi?.title) return null;
  if (structureName && normalizeString(poi.title).trim() === normalizeString(structureName).trim())
    return null;
  return poi.title;
};
