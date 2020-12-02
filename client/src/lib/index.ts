export const jsUcfirst = (string: string) =>
  string &&
  string.length > 1 &&
  string.charAt(0).toUpperCase() + string.slice(1, string.length);

export const limitNbCaracters = (string: string, nbCaractersMax: number) =>
  string.substring(0, Math.min(string.length, nbCaractersMax)) +
  (string.length > nbCaractersMax ? "..." : "");
