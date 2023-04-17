import {
  ContentStructure,
  ContentType,
  DispositifStatus,
  Id,
  InfoSection,
  InfoSections,
  Languages,
  Metadatas,
  Poi,
  SimpleDispositif,
  SimpleUser,
  Sponsor,
} from "../generics";

export enum ViewsType {
  WEB = "web",
  MOBILE = "mobile",
  FAVORITE = "favorite",
}
type Facets = "nbMercis" | "nbVues" | "nbVuesMobile" | "nbDispositifs" | "nbDemarches" | "nbUpdatedRecently";

/**
 * @url GET /dispositifs/count
 */
export interface CountDispositifsRequest {
  type: ContentType;
  publishedOnly: boolean;
  themeId?: string;
}

/**
 * @url GET /dispositifs
 */
export interface GetDispositifsRequest {
  type?: ContentType;
  locale: string;
  limit?: number;
  sort?: string;
}

/**
 * @url GET /dispositifs/getContentsForApp
 */
export enum MobileFrenchLevel {
  "Je ne lis et n'écris pas le français" = "Je ne lis et n'écris pas le français",
  "Je parle un peu" = "Je parle un peu",
  "Je parle bien" = "Je parle bien",
  "Je parle couramment" = "Je parle couramment",
}
export interface GetContentsForAppRequest {
  locale: Languages;
  age?: "0 à 17 ans" | "18 à 25 ans" | "26 ans et plus";
  county?: string;
  frenchLevel?: MobileFrenchLevel;
  strictLocation?: boolean;
}

/**
 * @url GET /dispositifs/getContentsForApp
 */
export interface ContentForApp {
  _id: string;
  titreInformatif: string;
  titreMarque: string;
  theme: Id;
  secondaryThemes: Id[];
  needs: Id[];
  nbVues: number;
  nbVuesMobile: number;
  typeContenu: ContentType;
  sponsorUrl: string;
}

export type GetContentsForAppResponse = {
  dataFr: ContentForApp[];
  data?: ContentForApp[];
};

/**
 * @url GET /dispositifs/statistics
 */
export interface GetStatisticsRequest {
  facets?: Facets[];
}

/**
 * @url PATCH /dispositifs/{id}/admin-comments
 */
export interface AdminCommentsRequest {
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
}

/**
 * @url PATCH /dispositifs/{id}/main-sponsor
 */
export interface MainSponsorRequest {
  sponsorId: string;
}

/**
 * @url PATCH /dispositifs/{id}/status
 */
export interface DispositifStatusRequest {
  status: DispositifStatus;
}

/**
 * @url PATCH /dispositifs/{id}/themes-needs
 */
export interface DispositifThemeNeedsRequest {
  theme?: string;
  secondaryThemes?: string[];
  needs?: string[];
}

/**
 * @url POST /dispositifs/{id}/views
 */
export interface AddViewsRequest {
  types: ViewsType[];
}

/**
 * @url PATCH /dispositifs/{id}/properties
 */
export interface UpdateDispositifPropertiesRequest {
  webOnly: boolean;
}

interface DispositifRequest {
  titreInformatif?: string;
  titreMarque?: string;
  abstract?: string;
  what?: string;
  why?: { [key: string]: InfoSection };
  how?: { [key: string]: InfoSection };
  next?: { [key: string]: InfoSection };
  mainSponsor?: string | Sponsor;
  contact?: {
    name: string;
    email: string;
    phone: string;
    comments: string;
    isStructureContact: boolean;
  };
  theme?: string;
  secondaryThemes?: string[];
  sponsors?: Sponsor[];
  metadatas?: Metadatas;
  map?: Poi[];
}

/**
 * @url PUT /dispositifs/{id}/suggestion
 */
export interface AddSuggestionDispositifRequest {
  suggestion: string;
  key: string;
}
/**
 * @url PATCH /dispositifs/{id}/suggestion
 */
export interface ReadSuggestionDispositifRequest {
  suggestionId: string;
}

/**
 * @url PATCH /dispositifs/{id}
 */
export interface UpdateDispositifRequest extends DispositifRequest { }

/**
 * @url PATCH /dispositifs/{id}/publish
 */
export interface PublishDispositifRequest {
  keepTranslations?: boolean;
}

/**
 * @url PATCH /dispositifs/{id}/structure-receive
 */
export interface StructureReceiveDispositifRequest {
  accept: boolean;
}

/**
 * @url POST /dispositifs
 */
export interface CreateDispositifRequest extends DispositifRequest {
  typeContenu: ContentType;
}

/**
 * @url GET /dispositifs/{id}
 */
export type GetDispositifResponse = {
  _id: Id;
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
  what: string;
  why?: InfoSections;
  how: InfoSections;
  next?: InfoSections;
  typeContenu: ContentType;
  status: DispositifStatus;
  mainSponsor?: ContentStructure;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  sponsors?: (Sponsor | ContentStructure)[];
  participants: SimpleUser[];
  merci: { created_at: Date; userId?: Id }[];
  metadatas: Metadatas;
  map: Poi[];
  availableLanguages: string[];
  date: Date;
  lastModificationDate?: Date;
  externalLink?: string;
};

/**
 * @url GET /dispositifs/user-contributions
 */
export interface GetUserContributionsResponse {
  _id: Id;
  titreInformatif: string;
  titreMarque: string;
  typeContenu: ContentType;
  mainSponsor: {
    nom: string;
  };
  nbVues: number;
  nbMercis: number;
  status: DispositifStatus;
}

/**
 * @url GET /dispositifs/count
 */
export interface GetCountDispositifsResponse {
  count: number;
}

/**
 * @url GET /dispositifs/statistics
 */
export interface GetStatisticsResponse {
  nbMercis?: number;
  nbVues?: number;
  nbVuesMobile?: number;
  nbDispositifs?: number;
  nbDemarches?: number;
  nbUpdatedRecently?: number;
}

/**
 * @url GET /dispositifs/region-statistics
 */
export interface GetRegionStatisticsResponse {
  regionFigures: {
    region: string;
    nbDispositifs: number;
    nbDepartments: number;
    nbDepartmentsWithDispo: number;
  }[];
  dispositifsWithoutGeoloc: Id[];
}

/**
 * @url GET /dispositifs/getNbContentsForCounty
 */
export interface GetNbContentsForCountyRequest {
  /**
   * Département par lequel filter
   */
  county: string;
}

/**
 * @url GET /dispositifs/getNbContentsForCounty
 */
export interface GetNbContentsForCountyResponse {
  /**
   * Nombre total de contenus
   */
  nbGlobalContent: number;

  /**
   * Nombre de contenus traduits
   */
  nbLocalizedContent: number;
}

type Author = {
  _id: Id;
  username: string;
};

/**
 * @url GET /dispositifs/all
 */
export interface GetAllDispositifsResponse {
  _id: Id;
  titreInformatif: string;
  titreMarque: string;
  typeContenu: ContentType;
  status: DispositifStatus;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  created_at?: Date;
  publishedAt?: Date;
  publishedAtAuthor: Author;
  updatedAt?: Date;
  lastModificationDate?: Date;
  lastAdminUpdate?: Date;
  nbMots: number;
  nbVues: number;
  nbMercis: number;
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
  draftReminderMailSentDate?: Date;
  draftSecondReminderMailSentDate?: Date;
  lastReminderMailSentToUpdateContentDate?: Date;
  lastModificationAuthor: Author;
  mainSponsor: ContentStructure;
  themesSelectedByAuthor: boolean;
  webOnly: boolean;
  creatorId: SimpleUser;
}

/**
 * @url POST /dispositifs
 */
export interface PostDispositifsResponse {
  id: Id;
}

/**
 * @url GET /dispositifs
 */
export type GetDispositifsResponse = SimpleDispositif;
