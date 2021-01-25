export const jsUcfirst = (string: string) =>
  string &&
  string.length > 1 &&
  string.charAt(0).toUpperCase() + string.slice(1, string.length);

export const limitNbCaracters = (string: string, nbCaractersMax: number) =>
  string.substring(0, Math.min(string.length, nbCaractersMax)) +
  (string.length > nbCaractersMax ? "..." : "");

export const removeAccents = (str = "") => {
  var accents =
    "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
  var accentsOut =
    "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  const newStr = str.split("");
  var i, x;
  for (i = 0; i < str.length; i++) {
    if ((x = accents.indexOf(str[i])) !== -1) {
      newStr[i] = accentsOut[x];
    }
  }
  return newStr.join("");
};
