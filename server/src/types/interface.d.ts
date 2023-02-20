import { Types } from "mongoose";
import { Moment } from "moment";
import { Languages, NeedId, Role, ThemeId, User } from "src/typegoose";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { DocumentType } from "@typegoose/typegoose";
import { ageType, frenchLevel, justificatifType, priceDetails, publicType } from "./newInterface";

export type Modify<T, R> = Omit<T, keyof R> & R;

declare global {
  namespace Express {
    export interface Request {
      fromSite?: boolean; // TODO: delete
      fromPostman?: boolean; // TODO: delete
      roles?: Role[]; // TODO: delete? (get it in the workflow)
      user?: DocumentType<User>;
      userId?: typeof User._id;
    }
  }
}

/**
 *  @see https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript
 */
export type ExcludeMethods<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]>;

export interface Request extends ExpressRequest { }
// Exposed to avoid Request name conflict
export interface IRequest extends Request { }
export interface Res extends ExpressResponse { }
// export interface Response<CustomResponse = any> extends ExpressResponse<{ text?: string; data?: CustomResponse }> {}

type ResponseText = "success" | "error";
interface APIResponse {
  text: ResponseText;
  code?: string;
}
interface APIResponseWithData<Data> extends APIResponse {
  data: Data;
}

export type Response = Promise<APIResponse>;
export type ResponseWithData<Data> = Promise<APIResponseWithData<Data>>;

interface Config {
  secret?: string;
}

export interface RequestFromClient<Query> extends Request {
  body?: {
    query: Query;
    sort: Record<string, any>;
    populate?: string | any;
    locale?: Languages;
    limit?: number;
  };
  query?: Query;
}

export interface RequestFromClientWithBody<Query> extends Request {
  body: Query;
  query?: Query;
  params?: any;
}

export interface RequestFromClientWithFiles extends Request {
  files: any;
}

export type Id = ExcludeMethods<Types.ObjectId | string>;

export interface AudienceAge {
  contentTitle: "Plus de ** ans" | "De ** à ** ans" | "Moins de ** ans";
  bottomValue: number | string;
  topValue: number | string;
}

export interface Picture {
  imgId: string | null;
  public_id: string | null;
  secure_url: string | null;
}

export interface ContentStructure {
  _id: Id;
  nom: string;
  picture: Picture;
  status: string;
}

export interface UserStructure {
  _id: Id;
  nom: string;
  picture: Picture;
  role: string[];
}

export interface SimpleUser {
  _id: Id;
  username: string;
  picture: Picture | undefined;
  email: string | undefined;
  roles?: string[];
}

export interface StructureMember {
  userId: string;
  username: string;
  picture: Picture;
  last_connected: Date;
  roles: string[];
  added_at: Date;
  mainRole: string;
}

export interface Metadatas {
  location?: string[];
  frenchLevel?: frenchLevel[];
  important?: string;
  age?: {
    type: ageType;
    ages: number[];
  };
  price?: {
    value: number;
    details?: priceDetails;
  }
  duration?: string;
  public?: publicType;
  titreSejourRequired?: boolean;
  acteNaissanceRequired?: boolean;
  justificatif?: justificatifType;
}

export interface SimpleDispositif {
  _id: Id;
  titreInformatif?: string;
  titreMarque?: string;
  abstract?: string;
  typeContenu: string;
  status: string;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  metadatas: Metadatas;
  created_at?: Date;
  publishedAt?: Date;
  lastModificationDate?: Date;
  nbMots: number;
  nbVues: number;
  mainSponsor?: {
    nom: string;
    picture: Picture
  }
}

export interface DispositifContent {
  type: string;
  title: string;
  editable: boolean;
  content: string;
  children?: DispositifContent[];
  placeholder?: string;
  tutoriel?: Record<string, string>;
  target?: string;
  contentTitle?: string;
  isFakeContent?: boolean;
  titleIcon?: string;
  typeIcon?: string;
  bottomValue?: number;
  topValue?: number;
  free?: boolean;
  price?: number;
  footerHref?: string;
  footerIcon?: string;
  footer?: string;
  niveaux?: string[];
  departments?: string[];
  contentBody?: string;
  ageTitle?: string;
  noContent?: boolean;
}

// Themes
export type TranslatedText = Record<string, string>;

export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}

export interface Theme {
  _id: Id;
  name: TranslatedText;
  short: TranslatedText;
  colors: ThemeColors;
  position: number;
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  notificationEmoji: string;
  adminComments?: string;
}

// Need
interface NeedTranslation {
  text: string;
  subtitle: string;
  updatedAt?: Date;
}

export interface DetailedOpeningHours {
  day: string;
  from0?: string;
  to0?: string;
  from1?: string;
  to1?: string;
}
export interface OpeningHours {
  details: DetailedOpeningHours[];
  noPublic: boolean;
  precisions?: string;
}

export interface Membre {
  userId: Types.ObjectId;
  roles: string[];
}
export interface IStructure {
  _id: Types.ObjectId;
  membres: Membre[];
  acronyme: string;
  administrateur: Types.ObjectId;
  adresse: string;
  authorBelongs: boolean;
  contact: string;
  created_at: Moment;
  createur: Types.ObjectId;
  dispositifsAssocies: Types.ObjectId[];
  link: string;
  mail_contact: string;
  mail_generique: string;
  nom: string;
  phone_contact: string;
  siren: string;
  siret: string;
  status: string;
  updatedAt: Moment;
  picture: Picture;
  structureTypes: string[];
  websites: string[];
  facebook: string;
  linkedin: string;
  twitter: string;
  activities: string[];
  departments: string[];
  phonesPublic: string[];
  adressPublic: string;
  openingHours: OpeningHours;
  description: string;
  hasResponsibleSeenNotification?: boolean;
  toJSON?: () => IStructure;
}

export interface SelectedLanguage {
  langueFr: string;
  langueLoc: string;
  langueCode: string;
  i18nCode: string;
  _id: Types.ObjectId;
}

export interface NeedDetail {
  text: string;
  updatedAt: Moment;
}
export interface Need {
  fr: NeedDetail;
  ar?: NeedDetail;
  en?: NeedDetail;
  ti?: NeedDetail;
  ru?: NeedDetail;
  ps?: NeedDetail;
  fa?: NeedDetail;
  uk?: NeedDetail;
  _id: Types.ObjectId;
  created_at: Moment;
  updatedAt: Moment;
}

export interface AlgoliaObject {
  objectID: Types.ObjectId | string;
  title_fr: string;
  title_ru?: string;
  title_en?: string;
  title_fa?: string;
  title_ar?: string;
  title_ps?: string;
  title_uk?: string;
  title_ti?: string;
  name_fr?: string;
  name_ru?: string;
  name_en?: string;
  name_fa?: string;
  name_ar?: string;
  name_ps?: string;
  name_uk?: string;
  name_ti?: string;
  abstract_fr?: string;
  abstract_ar?: string;
  abstract_en?: string;
  abstract_fa?: string;
  abstract_ru?: string;
  abstract_ps?: string;
  abstract_uk?: string;
  abstract_ti?: string;
  sponsorName?: string;
  sponsorUrl?: string;
  nbVues?: number;
  theme?: ThemeId;
  secondaryThemes?: ThemeId[];
  needs?: NeedId[];
  typeContenu: "demarche" | "dispositif" | "besoin" | "theme";
  priority: number;
  webOnly: boolean;
}
