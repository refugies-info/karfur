import { SimplifiedStructure, SimplifiedUser } from "types/interface";

export const escapeRegexCharacters = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSuggestionValue = (suggestion: SimplifiedUser | SimplifiedStructure) => {
  if ("acronyme" in suggestion) {
    return (suggestion.acronyme || "") +
      (suggestion.acronyme && suggestion.nom ? " - " : "") +
      (suggestion.nom || "")
  }
  return (suggestion.username || "") +
    (suggestion.username && suggestion.email ? " - " : "") +
    (suggestion.email || "");
}
// : suggestion.titreMarque || suggestion.titreInformatif //+ (suggestion.titreMarque && suggestion.titreInformatif ? " - " : "") + suggestion.titreInformatif;


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
