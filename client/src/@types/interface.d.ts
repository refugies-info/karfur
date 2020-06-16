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

export interface DispositifContent {
  type: string;
  title: string;
  editable: boolean;
  content: string;
  children?: DispositifContent[];
  isFakeContent?: boolean;
  placeholder?: string;
  tutoriel?: Record<string, string>;
  target?: string;
}

export interface Dispositif {
  _id: ObjectId;
  abstract: string;
  audience: string[];
  audienceAge: {
    bottomValue: number;
    contentTitle: string;
    topValue: number;
  }[];
  autoSave: boolean;
  avancement: Record<string, number>;
  bravo: {
    createdAt: Moment;
    keyValue: number;
    subkey: number;
    suggestionId: string;
  }[];
  contact: string;
  contenu: DispositifContent[];
  created_at: Moment;
  creatorId: User;
  externalLink: string;
  mainSponsor: Structure;
  merci: { createdAt: Moment; keyValue: number; subkey: null | number }[];
  nbMots: number;
  niveauFrancais: string[];
  participants: User[];
  signalements: any[];
  sponsors: Structure[];
  status: string;
  suggestions: any[];
  tags: {
    darkColor: string;
    hoverColor: string;
    illustrationColor: string;
    lightColor: string;
    name: string;
    short: string;
  }[];
  titreInformatif: string;
  titreMarque: string;
  traductions: ObjectId[];
  typeContenu: "dispositif" | "demarche";
  updatedAt: Moment;
}

export interface Structure {
  _id: ObjectId;
  membres: { userId: ObjectId; roles: string[] }[];
}
