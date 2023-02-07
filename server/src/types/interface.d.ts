import { Types } from "mongoose";
import { Moment } from "moment";
import { NeedId, Role, ThemeId, User } from "src/typegoose";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";

export type Modify<T, R> = Omit<T, keyof R> & R;

declare global {
  namespace Express {
    export interface Request {
      fromSite?: boolean;
      fromPostman?: boolean;
      roles?: Role[];
      user?: User;
      userId?: typeof User._id;
    }
  }
}

export interface Request extends ExpressRequest { }
export interface Res extends ExpressResponse { }


type ResponseText = "success" | "error";
export interface Response {
  text: ResponseText;
}
export interface ResponseWithData<Data> {
  text: ResponseText;
  data: Data;
}

interface Config {
  secret?: string;
}

export interface RequestFromClient<Query> extends Request {
  body?: {
    query: Query;
    sort: Record<string, any>;
    populate?: string;
    locale?: string;
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

export interface AudienceAge {
  contentTitle: "Plus de ** ans" | "De ** à ** ans" | "Moins de ** ans";
  bottomValue: number | string;
  topValue: number | string;
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

export interface Picture {
  imgId: string | null;
  public_id: string | null;
  secure_url: string | null;
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
