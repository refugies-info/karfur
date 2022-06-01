import { ObjectId } from "mongoose";
import { Moment } from "moment";
import { UserDoc } from "../schema/schemaUser";

export interface RequestFromClient<Query> {
  body?: {
    query: Query;
    sort: Record<string, any>;
    populate?: string;
    locale?: string;
  };
  fromSite: boolean;
  fromPostman: boolean;
  query?: Query;
  userId?: ObjectId;
  user?: UserDoc;
  roles?: { nom: string; _id: ObjectId }[];
}

export interface RequestFromClientWithBody<Query> {
  body: Query;
  fromSite: boolean;
  fromPostman: boolean;
  query?: Query;
  userId?: ObjectId;
  user?: UserDoc;
  roles: { nom: string; _id: ObjectId }[];
  params?: any
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

export interface Res {
  status: Function;
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

export type IDispositif = any;

export interface Membre {
  userId: ObjectId;
  roles: string[];
}
export interface IStructure {
  _id: ObjectId;
  membres: Membre[];
  acronyme: string;
  administrateur: ObjectId;
  adresse: string;
  authorBelongs: boolean;
  contact: string;
  created_at: Moment;
  createur: ObjectId;
  dispositifsAssocies: ObjectId[];
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

export interface IMailEvent {
  username?: string;
  email: string;
  templateName: string;
  userId?: ObjectId;
  dispositifId?: ObjectId;
  langue?: string;
}

export interface SelectedLanguage {
  langueFr: string;
  langueLoc: string;
  langueCode: string;
  i18nCode: string;
  _id: ObjectId;
}

export interface UserForMailing {
  username: string;
  _id: ObjectId;
  email: string;
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
  _id: ObjectId;
  tagName: string;
  created_at: Moment;
  updatedAt: Moment;
}

export interface AlgoliaObject {
  objectID: ObjectId | string;
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
  tags?: string[];
  needs?: ObjectId[];
  typeContenu: "demarche"|"dispositif"|"besoin"|"theme";
  priority: number;
}
