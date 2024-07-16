import { ContentType, InfoSection, InfoSections, Languages, Picture, RichText } from "../generics";

export type TraductionsType = "suggestion" | "validation";

export enum TraductionsStatus {
  /**
   * Langue complétement traduite
   */
  VALIDATED = "VALIDATED",
  /**
   * Langue à revoir par un traducteur expert
   */
  TO_REVIEW = "TO_REVIEW",
  /**
   * En attente d'une validation par un traducteur expert
   */
  PENDING = "PENDING",
  /**
   * Langue ouverte à la traduction par les traducteurs
   */
  TO_TRANSLATE = "TO_TRANSLATE",
}

export interface Content {
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
}

export interface DispositifContent extends Content {
  what: RichText;
  why: { [key: string]: InfoSection };
  how: InfoSections;
}
export interface DemarcheContent extends Content {
  what: RichText;
  how: InfoSections;
  next: InfoSections;
}

export interface TranslationContent {
  content: DispositifContent | DemarcheContent;
  // keep "content" prop to be able to add "metadatas" later
}

export interface GetTraductionsForReview {
  translated: Partial<TranslationContent>;
  validator?: {
    id: string;
    username: string;
    picture?: Picture;
  }
  author: {
    id: string;
    username: string;
    picture?: Picture;
  }
  toReview?: string[];
  toFinish: string[];
}
export type GetTraductionsForReviewResponse = GetTraductionsForReview[];

export interface TranslateRequest {
  q: string;
  language: Languages;
}

export interface SaveTranslationRequest {
  dispositifId: string;
  language: Languages;
  timeSpent: number; // must be resetted between each submit
  toFinish: string[];
  toReview: string[];
  translated: Partial<{
    content: {
      titreInformatif?: string;
      titreMarque?: string;
      abstract?: string;
      what?: RichText;
      why?: { [key: string]: Partial<InfoSection> };
      how?: { [key: string]: Partial<InfoSection> };
      next?: { [key: string]: Partial<InfoSection> };
    };
  }>;
}

export interface SaveTranslationResponse {
  translation: {
    dispositifId: string;
    userId: string;
    language: Languages;
    translated: Partial<TranslationContent>;
    timeSpent: number;
    toReview?: string[];
    type: TraductionsType;
    created_at: Date;
    updatedAt: Date;
  };
}

export interface GetDefaultTraductionResponse {
  translation: TranslationContent;
}

export interface GetDispositifsWithTranslationAvancementResponse {
  _id: string;
  titreInformatif: string;
  titreMarque: string;
  nbMots: number;
  created_at: Date;
  type: ContentType;
  lastTradUpdatedAt: number | null;
  avancementTrad: number; // word count
  avancementValidation: number; // word count
  tradStatus: TraductionsStatus;
}

export interface DeleteTranslationsRequest {
  dispositifId: string;
  locale: Languages;
}

export interface GetProgressionRequest {
  userId?: string;
  onlyTotal?: boolean;
}
export interface ProgressionIndicator {
  wordsCount: number;
  timeSpent: number;
}
export interface GetProgressionResponse {
  twelveMonthsIndicator?: ProgressionIndicator;
  sixMonthsIndicator?: ProgressionIndicator;
  threeMonthsIndicator?: ProgressionIndicator;
  totalIndicator: ProgressionIndicator;
}

type TranslationStatisticsFacets = "nbTranslators" | "nbRedactors" | "nbWordsTranslated" | "nbActiveTranslators";
export interface TranslationStatisticsRequest {
  facets?: TranslationStatisticsFacets[];
}

export interface Statistics {
  nbTranslators?: number;
  nbRedactors?: number;
  nbWordsTranslated?: number;
  nbActiveTranslators?: {
    languageId: string;
    count: number;
  }[];
}

export interface TranslationStatisticsResponse extends Statistics { }

export interface PublishTranslationRequest {
  dispositifId: string;
  language: Languages;
}

export interface TranslatorFeedback {
  translatorId: string;
  note: number;
  comment: string;
}

export interface SendFeedbackRequest {
  contentId: string;
  language: Languages;
  feedbacks: TranslatorFeedback[];
}
