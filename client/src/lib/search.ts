import { SimpleUser } from "api-types";

export const escapeRegexCharacters = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSuggestionValue = (suggestion: SimpleUser) => {
  return (suggestion.username || "") +
    (suggestion.username && suggestion.email ? " - " : "") +
    (suggestion.email || "");
}
// : suggestion.titreMarque || suggestion.titreInformatif //+ (suggestion.titreMarque && suggestion.titreInformatif ? " - " : "") + suggestion.titreInformatif;
