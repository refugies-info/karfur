import type { Poi } from "@refugies-info/api-types";

export const getPoiLocationText = (poi?: Poi): string => {
  if (!poi?.address) return poi?.city ?? "";
  if (poi.city && !poi.address.toLowerCase().includes(poi.city.toLowerCase())) {
    return `${poi.address}, ${poi.city}`;
  }
  return poi.address;
};
