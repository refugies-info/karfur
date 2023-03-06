import { ContentStructure, ContentType, DispositifStatus, Id, InfoSection, InfoSections, Metadatas, SimpleDispositif, SimpleUser, Sponsor } from "../generics";

type ViewsType = "web" | "mobile" | "favorite";
type Facets = "nbMercis" | "nbVues" | "nbVuesMobile" | "nbDispositifs" | "nbDemarches" | "nbUpdatedRecently";

/**
 * @url GET /dispositifs/count
 */
export interface CountDispositifsRequest {
  type: ContentType;
  publishedOnly: boolean
  themeId?: string;
}

/**
 * @url GET /dispositifs
 */
export interface GetDispositifsRequest {
  type?: ContentType;
  locale: string
  limit?: number
  sort?: string
}

/**
 * @url GET /dispositifs/statistics
 */
export interface GetStatisticsRequest {
  facets?: Facets[]
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
 * @url POST /dispositifs/{id}/views
 */
export interface AddViewsRequest {
  types: ViewsType[]
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
  mainSponsor?: string;
  theme?: string;
  secondaryThemes?: string[];
  // sponsors?: (Sponsor | SponsorDB)[];
  metadatas?: Metadatas;
  // map: Poi[];
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
 * @url POST /dispositifs
 */
export interface CreateDispositifRequest extends DispositifRequest {
  typeContenu: ContentType;
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
  mainSponsor?: ContentStructure
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  sponsors?: (Sponsor | ContentStructure)[];
  participants: SimpleUser[];
  merci: { created_at: Date, userId?: Id }[];
  metadatas: Metadatas;
  map: Poi[];
  availableLanguages: string[];
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
  }
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
  nbMercis?: number
  nbVues?: number
  nbVuesMobile?: number
  nbDispositifs?: number
  nbDemarches?: number
  nbUpdatedRecently?: number
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
  }[],
  dispositifsWithoutGeoloc: Id[]
}

type Author = {
  _id: Id;
  username: string;
}

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
  themesSelectedByAuthor: boolean
  webOnly: boolean;
  creatorId: SimpleUser;
}

/**
 * @url GET /dispositifs
 */
export type GetDispositifsResponse = SimpleDispositif;
