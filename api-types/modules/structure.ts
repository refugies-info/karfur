import { Id, Picture, SimpleDispositif, SimpleUser, StructureMember } from "../generics";

type StructureFacets = "nbStructures" | "nbCDA" | "nbStructureAdmins";
/**
 * @url GET /structures/statistics
 */
export interface GetStructureStatisticsRequest {
  facets?: StructureFacets[];
}

/**
 * @url POST /structures
 */
export interface PostStructureRequest {
  picture: Picture | null;
  contact: string;
  phone_contact: string;
  mail_contact: string;
  responsable: string | null;
  nom: string;
}

// TODO: refactor when rebuild add structure
/**
 * @url PATCH /structures/{id}
 */
export interface PatchStructureRequest {
  picture?: Picture | null;
  contact?: string;
  phone_contact?: string;
  mail_contact?: string;
  responsable?: string | null;
  nom?: string;
  adminComments?: string;
  status?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string
  hasResponsibleSeenNotification?: boolean
}

/**
 * @url PATCH /structures/{id}/roles
 */
export interface PatchStructureRolesRequest {
  membreId: string;
  action: "delete" | "modify" | "create";
  role?: string;
}


interface Membre {
  userId: Id;
  roles: string[];
}
/**
 * @url GET /structures/all
 */
export interface GetAllStructuresResponse {
  _id: Id;
  nom: string;
  acronyme?: string;
  status?: string;
  picture?: Picture;
  nbMembres: number;
  created_at?: Date;
  createur: null | SimpleUser;
  responsable: null | SimpleUser;
  membres: Membre[];
  dispositifsIds: Id[];
  nbFiches: number;
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
}

/**
 * @url GET /structures/getActiveStructures
 */
export interface GetActiveStructuresResponse {
  _id: Id;
  nom: string;
  acronyme?: string;
  picture?: Picture;
  structureTypes?: string[];
  departments?: string[];
  disposAssociesLocalisation?: string[];
}

/**
 * @url GET /structures/statistics
 */
export interface GetStructureStatisticsResponse {
  nbStructures?: number;
  nbCDA?: number;
  nbStructureAdmins?: number;
}


interface DetailedOpeningHours {
  day: string;
  from0?: string;
  to0?: string;
  from1?: string;
  to1?: string;
}

interface OpeningHours {
  details: DetailedOpeningHours[];
  noPublic: boolean;
  precisions?: string;
}

/**
 * @url GET /structures/{id}
 */
export interface GetStructureResponse {
  _id: Id;
  acronyme?: string;
  administrateur: Id;
  adresse?: string;
  authorBelongs?: Boolean;
  contact?: string;
  createur: Id;
  link?: string;
  mail_contact?: string;
  mail_generique?: string;
  nom: string;
  phone_contact?: string;
  siren?: string;
  siret?: string;
  status?: string;
  picture?: Picture;
  structureTypes?: string[];
  websites?: string[];
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  activities?: string[];
  departments?: string[];
  phonesPublic?: string[];
  mailsPublic?: string[];
  adressPublic?: string;
  openingHours?: OpeningHours;
  onlyWithRdv?: Boolean;
  description?: string;
  hasResponsibleSeenNotification?: Boolean;
  disposAssociesLocalisation?: string[];
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus: string;

  membres: StructureMember[];
  dispositifsAssocies: SimpleDispositif[];
}
