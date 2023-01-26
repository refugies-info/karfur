export const jsUcfirst = (string: string) =>
  string &&
  string.length > 1 &&
  string.charAt(0).toUpperCase() + string.slice(1, string.length);

export const jsLcfirst = (string: string) =>
  string &&
  string.length > 1 &&
  string.charAt(0).toLowerCase() + string.slice(1, string.length);

export const limitNbCaracters = (string: string, nbCaractersMax: number) =>
  string.substring(0, Math.min(string.length, nbCaractersMax)) +
  (string.length > nbCaractersMax ? "..." : "");

export const removeAccents = (str = "") => {
  var accents =
    "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
  var accentsOut =
    "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  const chars = str.split("");
  let i, x;
  for (i = 0; i < chars.length; i++) {
    if ((x = accents.indexOf(chars[i])) !== -1) {
      chars[i] = accentsOut[x];
    }
  }
  return chars.join("");
};
