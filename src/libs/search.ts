import {
  commonSearchableAttributes,
  localizedSearchableAttributes
} from "../data/searchData";

export const getSearchableAttributes = (selectedLanguage: string | null) => {
  const localizedAttributes: string[] = []

  for (const attr of localizedSearchableAttributes) {
    localizedAttributes.push(`${attr}_fr`);
    if (selectedLanguage && selectedLanguage !== "fr") localizedAttributes.push(`${attr}_${selectedLanguage}`);
  }

  return [
    ...localizedAttributes,
    ...commonSearchableAttributes,
  ]
};
