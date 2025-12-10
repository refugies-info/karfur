export type {
  Age,
  Avis,
  Commitment,
  DemarcheContent,
  Dispositif,
  DispositifContent,
  DispositifId,
  Frequency,
  InfoSection,
  InfoSections,
  Merci,
  Metadatas,
  Poi,
  Price,
  Sponsor,
  Suggestion,
  TranslationContent,
} from "@refugies-info/mongo";

// Content class was abstract in Typegoose, but effectively just shared props.
// We can define it here if needed or let it go if not used as value.
// Checking downstream usage might be needed. For now simplest re-export of what was there.
export type Content = {
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
};
