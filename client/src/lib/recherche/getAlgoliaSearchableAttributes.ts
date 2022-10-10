export type Hit = { id: string, highlight: any };

const commonSearchableAttributes = [
  "sponsorName"
];

const localizedSearchableAttributes = [
  "title",
  "name",
  "titreMarque",
  "abstract"
];

export const getSearchableAttributes = (selectedLanguage: string | null) => {
  const localizedAttributes: string[] = []

  for (const attr of localizedSearchableAttributes) {
    localizedAttributes.push(`${attr}_fr`);
    if (selectedLanguage && selectedLanguage !== "fr" && selectedLanguage !== "default") localizedAttributes.push(`${attr}_${selectedLanguage}`);
  }

  return [
    ...localizedAttributes,
    ...commonSearchableAttributes,
  ]
};
