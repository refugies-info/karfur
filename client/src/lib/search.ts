import { SimplifiedUser } from "types/interface";

export const escapeRegexCharacters = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSuggestionValue = (suggestion: SimplifiedUser) => {
  return (suggestion.username || "") +
    (suggestion.username && suggestion.email ? " - " : "") +
    (suggestion.email || "");
}
// : suggestion.titreMarque || suggestion.titreInformatif //+ (suggestion.titreMarque && suggestion.titreInformatif ? " - " : "") + suggestion.titreInformatif;
