import { ObjectId } from "mongoose";

type RichText = string;
type Uuid = string;
type lnCode = string;
type frenchLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type ageType = "lessThan" | "moreThan" | "between";
type priceDetails = "une fois" | "à chaque fois" | "par heure" | "par semaine" | "par mois" | "par an";
type publicType = "réfugié" | "tout public";
type justificatifType = "diplome" | "titre sejour" | "acte naissance";
type contentType = "dispositif" | "demarche";

interface InfoSection {
  title: string;
  text: RichText;
}
type InfoSections = Record<Uuid, InfoSection>;

interface Content {
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
}

interface DispositifContent extends Content {
  what: RichText;
  why: InfoSections;
  how: InfoSections;
}
interface DemarcheContent extends Content {
  what: RichText;
  how: InfoSections;
  next: InfoSections;
}

interface Metadatas {
  location?: string[];
  frenchLevel?: frenchLevel[];
  important?: string;
  age?: { type: ageType, ages: number[] },
  price?: { value: number, details: priceDetails | null },
  duration?: string;
  public?: publicType;
  titreSejourRequired?: boolean;
  acteNaissanceRequired?: boolean;
  justificatif?: justificatifType;
}

interface Poi {
  title: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  description?: string;
  email?: string;
  phone?: string;
}

interface Sponsor {
  name: string;
  logo: string;
  link: string;
}

interface Suggestion {
  created_at: Date
  userId: ObjectId | null
  read: boolean
  suggestion: string
  suggestionId: Uuid
  section: keyof DispositifContent | keyof DemarcheContent
}

interface Merci {
  created_at: Date
  userId: ObjectId | null
}

interface TranslationContent {
  content: DispositifContent | DemarcheContent;
  metadata: {
    important?: string;
    duration?: string;
  }
}

// COLLECTION
interface Dispositif {
  _id: ObjectId;

  translations: Record<lnCode, TranslationContent>; // copié à la racine quand envoyé en front
  metadatas: Metadatas;
  map: Poi[];

  type: contentType;
  status: "actif" | "brouillon"; // TODO: clean type
  mainSponsor: ObjectId | null;
  theme: ObjectId | null;
  secondaryThemes: ObjectId[];
  needs: ObjectId[];
  contact: string;
  externalLink: string;
  sponsors: (ObjectId | Sponsor)[];

  creatorId: ObjectId;
  participants: ObjectId[];
  lastAdminUpdate: Date | null;
  lastModificationAuthor: ObjectId | null;
  lastModificationDate: Date | null;
  publishedAt: Date | null;
  publishedAtAuthor: ObjectId | null;
  created_at: Date;
  updatedAt: Date;

  nbFavoritesMobile: number;
  nbVues: number;
  nbVuesMobile: number;
  nbMots: number;

  adminComments: string;
  adminPercentageProgressionStatus: string;
  adminProgressionStatus: string;

  draftReminderMailSentDate: Date | null;
  draftSecondReminderMailSentDate: Date | null;
  lastReminderMailSentToUpdateContentDate: Date | null;

  themesSelectedByAuthor: boolean;
  notificationsSent: Record<lnCode, boolean>;

  suggestions: Suggestion[];
  merci: Merci[];
  webOnly: boolean;
}


// COLLECTION
interface TranslationSuggestion {
  dispositifId: ObjectId;
  userId: ObjectId;
  language: lnCode;
  translated: Partial<TranslationContent>;
  timeSpent: number; // comment on le calcule ?
  type: "suggestion" | "validation"; // TODO: clean type
  avancement: number;
  toReview?: string[];

  created_at: Date;
  updatedAt: Date;
}
