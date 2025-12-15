/**
 * Department Search API Contract
 * Endpoint: https://geo.api.gouv.fr/departements
 *
 * This contract defines the expected request/response format for the
 * department search API used in the location search feature.
 */

/**
 * Request Contract
 */
export interface DepartmentSearchRequest {
  nom: string; // Department name search query (e.g., "Rhône")
  limit?: number; // Optional result limit
}

/**
 * Response Contract
 */
export type DepartmentSearchResponse = DepartmentItem[];

export interface DepartmentItem {
  code: string; // Department code (e.g., "69")
  nom: string; // Department name (e.g., "Rhône")
  codeRegion: string; // Region code (e.g., "84")
  region: string; // Region name (e.g., "Auvergne-Rhône-Alpes")
}

/**
 * Example Request
 */
export const DEPARTMENT_SEARCH_EXAMPLE_REQUEST = {
  nom: "Rhône",
};

/**
 * Example Response
 */
export const DEPARTMENT_SEARCH_EXAMPLE_RESPONSE: DepartmentSearchResponse = [
  {
    code: "69",
    nom: "Rhône",
    codeRegion: "84",
    region: "Auvergne-Rhône-Alpes",
  },
];

/**
 * Example Response (Multiple Results)
 */
export const DEPARTMENT_SEARCH_EXAMPLE_RESPONSE_MULTIPLE: DepartmentSearchResponse = [
  {
    code: "69",
    nom: "Rhône",
    codeRegion: "84",
    region: "Auvergne-Rhône-Alpes",
  },
  {
    code: "70",
    nom: "Haute-Saône",
    codeRegion: "27",
    region: "Bourgogne-Franche-Comté",
  },
];

/**
 * Example Response (No Results)
 */
export const DEPARTMENT_SEARCH_EXAMPLE_RESPONSE_EMPTY: DepartmentSearchResponse = [];

/**
 * Validation Rules
 */
export const DEPARTMENT_VALIDATION_RULES = {
  query: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-'àâäçèéêëîïôùûüœæ]+$/i,
    description:
      "Search query with letters, numbers, spaces, hyphens, apostrophes, and French accents",
  },
  response: {
    maxItems: 100,
    requiredFields: ["code", "nom", "codeRegion", "region"],
    description: "Response is array of department items with required fields",
  },
};

/**
 * Error Scenarios
 */
export const DEPARTMENT_ERROR_SCENARIOS = [
  {
    status: 400,
    message: "Bad Request",
    description: "Invalid query parameter",
  },
  {
    status: 404,
    message: "Not Found",
    description: "No results found for query (returns empty array)",
  },
  {
    status: 429,
    message: "Too Many Requests",
    description: "Rate limit exceeded",
  },
  {
    status: 500,
    message: "Internal Server Error",
    description: "API server error",
  },
];

/**
 * Performance SLA
 */
export const DEPARTMENT_PERFORMANCE_SLA = {
  p50: 50, // milliseconds
  p95: 150, // milliseconds
  p99: 300, // milliseconds
  timeout: 5000, // milliseconds
};

/**
 * Known Department Codes (Reference)
 */
export const KNOWN_DEPARTMENTS = {
  "01": "Ain",
  "02": "Aisne",
  "03": "Allier",
  "04": "Alpes-de-Haute-Provence",
  "05": "Hautes-Alpes",
  "06": "Alpes-Maritimes",
  "07": "Ardèche",
  "08": "Ardennes",
  "09": "Ariège",
  "10": "Aube",
  "11": "Aude",
  "12": "Aveyron",
  "13": "Bouches-du-Rhône",
  "14": "Calvados",
  "15": "Cantal",
  "16": "Charente",
  "17": "Charente-Maritime",
  "18": "Cher",
  "19": "Corrèze",
  "21": "Côte-d'Or",
  "22": "Côtes-d'Armor",
  "23": "Creuse",
  "24": "Dordogne",
  "25": "Doubs",
  "26": "Drôme",
  "27": "Eure",
  "28": "Eure-et-Loir",
  "29": "Finistère",
  "2A": "Corse-du-Sud",
  "2B": "Haute-Corse",
  "30": "Gard",
  "31": "Haute-Garonne",
  "32": "Gers",
  "33": "Gironde",
  "34": "Hérault",
  "35": "Ille-et-Vilaine",
  "36": "Indre",
  "37": "Indre-et-Loire",
  "38": "Isère",
  "39": "Jura",
  "40": "Landes",
  "41": "Loir-et-Cher",
  "42": "Loire",
  "43": "Haute-Loire",
  "44": "Loire-Atlantique",
  "45": "Loiret",
  "46": "Lot",
  "47": "Lot-et-Garonne",
  "48": "Lozère",
  "49": "Maine-et-Loire",
  "50": "Manche",
  "51": "Marne",
  "52": "Haute-Marne",
  "53": "Mayenne",
  "54": "Meurthe-et-Moselle",
  "55": "Meuse",
  "56": "Morbihan",
  "57": "Moselle",
  "58": "Nièvre",
  "59": "Nord",
  "60": "Oise",
  "61": "Orne",
  "62": "Pas-de-Calais",
  "63": "Puy-de-Dôme",
  "64": "Pyrénées-Atlantiques",
  "65": "Hautes-Pyrénées",
  "66": "Pyrénées-Orientales",
  "67": "Bas-Rhin",
  "68": "Haut-Rhin",
  "69": "Rhône",
  "70": "Haute-Saône",
  "71": "Saône-et-Loire",
  "72": "Sarthe",
  "73": "Savoie",
  "74": "Haute-Savoie",
  "75": "Paris",
  "76": "Seine-Maritime",
  "77": "Seine-et-Marne",
  "78": "Yvelines",
  "79": "Deux-Sèvres",
  "80": "Somme",
  "81": "Tarn",
  "82": "Tarn-et-Garonne",
  "83": "Var",
  "84": "Vaucluse",
  "85": "Vendée",
  "86": "Vienne",
  "87": "Haute-Vienne",
  "88": "Vosges",
  "89": "Yonne",
  "90": "Territoire de Belfort",
  "91": "Essonne",
  "92": "Hauts-de-Seine",
  "93": "Seine-Saint-Denis",
  "94": "Val-de-Marne",
  "95": "Val-d'Oise",
  "971": "Guadeloupe",
  "972": "Martinique",
  "973": "Guyane",
  "974": "Réunion",
  "976": "Mayotte",
};
