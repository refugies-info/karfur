import { ContentType, InfoSection, InfoSections, Languages, RichText, Uuid } from "../generics";

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

export class Content {
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
}

export class DispositifContent extends Content {
  what: RichText;
  why: { [key: string]: InfoSection };
  how: InfoSections;
}
export class DemarcheContent extends Content {
  what: RichText;
  how: InfoSections;
  next: InfoSections;
}

export class TranslationContent {
  public content!: DispositifContent | DemarcheContent;

  public metadatas!: {
    important?: string;
    duration?: string;
  };
}

export interface GetTraductionsForReview {
  author: string;
  translated: Partial<TranslationContent>;
  username: string;
  toReview?: string[];
}
export type GetTraductionsForReviewResponse = GetTraductionsForReview[];

export interface TranslateRequest {
  q: string;
  language: Languages;
}

export interface SaveTranslationRequest {
  dispositifId: string;
  language: Languages;
  timeSpent: number;
  translated: Partial<{
    content: Partial<Content> & {
      what?: RichText;
      why?: { [key: string]: Partial<InfoSection> };
      how?: { [key: string]: Partial<InfoSection> };
      next?: { [key: string]: Partial<InfoSection> };
    };
    metadatas: Partial<{
      important?: string;
      duration?: string;
    }>;
  }>;
}

export interface SaveTranslationResponse {
  translation: {
    dispositifId: string;
    userId: string;
    language: Languages;
    translated: Partial<TranslationContent>;
    // public validatorId: Ref<User>;
    timeSpent: number;
    avancement: number;
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
  avancementTrad: number;
  avancementValidation: number;
  tradStatus: TraductionsStatus;
}

export interface DeleteTranslationsRequest {
  dispositifId: string;
  locale: Languages;
}

export interface GetProgressionRequest {
  userId?: string;
}
export interface ProgressionIndicator {
  wordsCount: number;
  timeSpent: number;
}
export interface GetProgressionResponse {
  twelveMonthsIndicator: ProgressionIndicator;
  sixMonthsIndicator: ProgressionIndicator;
  threeMonthsIndicator: ProgressionIndicator;
  totalIndicator: ProgressionIndicator;
}

export type Facets = "nbTranslators" | "nbRedactors" | "nbWordsTranslated" | "nbActiveTranslators";
export interface TranslationStatisticsRequest {
  facets?: Facets[];
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

export interface TranslationStatisticsResponse extends Statistics {}
