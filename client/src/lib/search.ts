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
