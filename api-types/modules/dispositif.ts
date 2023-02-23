import { ContentStructure, Id, InfoSection, InfoSections, Metadatas, Picture, SimpleDispositif, SimpleUser, Sponsor } from "../generics";

type ViewsType = "web" | "mobile" | "favorite";
type Facets = "nbMercis" | "nbVues" | "nbVuesMobile" | "nbDispositifs" | "nbDemarches" | "nbUpdatedRecently";

/**
 * @url GET /dispositifs/count
 */
export interface CountDispositifsRequest {
  type: "dispositif" | "demarche"; // TODO: type
  publishedOnly: boolean
  themeId?: string;
}

/**
 * @url GET /dispositifs
 */
export interface GetDispositifsRequest {
  type?: "dispositif" | "demarche"; // TODO: type
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
  status: "Actif" | "Supprimé" | "Brouillon" | "En attente" | "En attente admin" | "En attente non prioritaire"; // TODO: type
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
 * @url PATCH /dispositifs/{id}
 */
export interface UpdateDispositifRequest extends DispositifRequest { }

/**
 * @url POST /dispositifs
 */
export interface CreateDispositifRequest extends DispositifRequest {
  typeContenu: "dispositif" | "demarche";
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
  typeContenu: string;
  status: string;
  mainSponsor?: ContentStructure
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  sponsors?: (Sponsor | ContentStructure)[];
  participants: SimpleUser[];
  merci: { created_at: Date, userId?: Id }[];
  metadatas: Metadatas;
  map: Poi[];
};

/**
 * @url GET /dispositifs/user-contributions
 */
export interface GetUserContributionsResponse {
  _id: Id;
  titreInformatif: string;
  titreMarque: string;
  typeContenu: string;
  mainSponsor: {
    nom: string;
  }
  nbVues: number;
  nbMercis: number;
  status: string;
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
  typeContenu: string;
  status: string;
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
