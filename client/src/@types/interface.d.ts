import { ObjectId } from "mongodb";
import { Moment } from "moment";

export interface RequestReturn<Y> {
  data: { data: Y };
}

export interface Picture {
  imgId: ObjectId;
  public_id: string;
  secure_url: string;
}

export interface Role {
  _id: ObjectId;
  nom: string;
  nomPublique: string;
}

export interface Language {
  langueFr: string;
  langueLoc?: string;
  langueCode?: string;
  langueIsDialect?: boolean;
  langueBackupId: ObjectId;
  status?: string;
  i18nCode: string;
  avancement?: number;
  participants: ObjectId[];
  created_at: Moment;
  updatedAt: Moment;
}

export interface User {
  username: string;
  email?: string;
  phone?: string;
  description?: string;
  objectifTemps?: number;
  objectifMots?: number;
  picture?: Picture;
  roles?: Role[];
  selectedLanguages?: Language[];
  notifyObjectifs?: boolean;
  objectifTempsContrib?: number;
  objectifMotsContrib?: number;
  notifyObjectifsContrib?: boolean;
  traductionsFaites?: ObjectId[];
  contributions?: ObjectId[];
  noteTraduction?: number;
  status?: string;
  cookies?: any;
  structures?: ObjectId[];
  last_connected?: Moment;
  updatedAt: Moment;
  created_at: Moment;
  _id: ObjectId;
}

export interface Dispositif {
  _id: ObjectId;
}

export interface Structure {
  _id: ObjectId;
}
