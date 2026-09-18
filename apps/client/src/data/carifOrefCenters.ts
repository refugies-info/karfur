import type { locationType } from "@refugies-info/api-types";

export interface CarifOrefCenter {
  /** "Numéro Carif": two first digits of an RCO content id, without leading zero */
  codes: string[];
  name: string;
  region: string;
  departments: string[];
  logoUrl: string;
}

export const carifOrefCenters: readonly CarifOrefCenter[] = [
  {
    codes: ["1", "8", "17"],
    name: "Région Grand Est, missions Carif-Oref",
    region: "Grand Est",
    departments: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
    logoUrl: "/images/sources/carif-oref-grand-est.webp",
  },
  {
    codes: ["2", "23"],
    name: "Cap Métiers Nouvelle-Aquitaine",
    region: "Nouvelle-Aquitaine",
    departments: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"],
    logoUrl: "/images/sources/carif-oref-nouvelle-aquitaine.webp",
  },
  {
    codes: ["3"],
    name: "Carif-Oref Auvergne-Rhône-Alpes",
    region: "Auvergne-Rhône-Alpes",
    departments: ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"],
    logoUrl: "/images/sources/carif-oref-auvergne-rhone-alpes.webp",
  },
  {
    codes: ["4", "13"],
    name: "Carif-Oref de Normandie",
    region: "Normandie",
    departments: ["14", "27", "50", "61", "76"],
    logoUrl: "/images/sources/carif-oref-normandie.webp",
  },
  {
    codes: ["6"],
    name: "GREF Bretagne",
    region: "Bretagne",
    departments: ["22", "29", "35", "56"],
    logoUrl: "/images/sources/carif-oref-bretagne.webp",
  },
  {
    codes: ["7"],
    name: "GIP Alfa Centre-Val de Loire",
    region: "Centre-Val de Loire",
    departments: ["18", "28", "36", "37", "41", "45"],
    logoUrl: "/images/sources/carif-oref-centre-val-de-loire.webp",
  },
  {
    // RCO files Corsican contents under 28, a number absent from their own table, which says 9
    codes: ["9", "28"],
    name: "Collectivité de Corse, missions CARIF OREF",
    region: "Corse",
    departments: ["2A", "2B"],
    logoUrl: "/images/sources/carif-oref-corse.webp",
  },
  {
    codes: ["10"],
    name: "Emfor Bourgogne-Franche-Comté",
    region: "Bourgogne-Franche-Comté",
    departments: ["21", "25", "39", "58", "70", "71", "89", "90"],
    logoUrl: "/images/sources/carif-oref-bourgogne-franche-comte.webp",
  },
  {
    codes: ["11"],
    name: "GIP Carif-Oref Guadeloupe",
    region: "Guadeloupe",
    departments: ["971"],
    logoUrl: "/images/sources/carif-oref-guadeloupe.webp",
  },
  {
    codes: ["12"],
    name: "Carif-Oref de Guyane",
    region: "Guyane",
    departments: ["973"],
    logoUrl: "/images/sources/carif-oref-guyane.webp",
  },
  {
    codes: ["14"],
    name: "Région Île-de-France",
    region: "Île-de-France",
    departments: ["75", "77", "78", "91", "92", "93", "94", "95"],
    logoUrl: "/images/sources/carif-oref-ile-de-france.webp",
  },
  {
    codes: ["15", "19"],
    name: "Carif-Oref Occitanie",
    region: "Occitanie",
    departments: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"],
    logoUrl: "/images/sources/carif-oref-occitanie.webp",
  },
  {
    codes: ["18"],
    name: "Agefma - Carif-Oref Martinique",
    region: "Martinique",
    departments: ["972"],
    logoUrl: "/images/sources/carif-oref-martinique.webp",
  },
  {
    codes: ["20", "22"],
    name: "C2RP Carif-Oref Hauts-de-France",
    region: "Hauts-de-France",
    departments: ["02", "59", "60", "62", "80"],
    logoUrl: "/images/sources/carif-oref-hauts-de-france.webp",
  },
  {
    codes: ["21"],
    name: "Cariforef Pays de la Loire",
    region: "Pays de la Loire",
    departments: ["44", "49", "53", "72", "85"],
    logoUrl: "/images/sources/carif-oref-pays-de-la-loire.webp",
  },
  {
    codes: ["24"],
    name: "Carif-Oref Provence - Alpes - Côte d'Azur",
    region: "Provence-Alpes-Côte d'Azur",
    departments: ["04", "05", "06", "13", "83", "84"],
    logoUrl: "/images/sources/carif-oref-provence-alpes-cote-d-azur.webp",
  },
  {
    codes: ["25"],
    name: "Réunion Prospective Compétences",
    region: "La Réunion",
    departments: ["974"],
    logoUrl: "/images/sources/carif-oref-la-reunion.webp",
  },
  {
    codes: ["39"],
    name: "GIP Carif-Oref de Mayotte",
    region: "Mayotte",
    departments: ["976"],
    logoUrl: "/images/sources/carif-oref-mayotte.webp",
  },
  {
    codes: ["42"],
    name: "Carif-Otef de Saint-Martin",
    region: "Saint-Martin",
    departments: ["977", "978"],
    logoUrl: "/images/sources/carif-oref-saint-martin.webp",
  },
  {
    codes: ["44"],
    name: "Carif-Oref de Nouvelle-Calédonie",
    region: "Nouvelle-Calédonie",
    departments: ["988"],
    logoUrl: "/images/sources/carif-oref-nouvelle-caledonie.webp",
  },
];

const getDepartmentCode = (location: string) => location.split(" - ")[0];
export const getCarifOrefCenterByLocation = (
  location?: locationType | null,
): CarifOrefCenter | undefined => {
  if (!Array.isArray(location)) return undefined;
  const departmentCodes = location.map(getDepartmentCode);
  return carifOrefCenters.find((center) =>
    departmentCodes.some((code) => center.departments.includes(code)),
  );
};
