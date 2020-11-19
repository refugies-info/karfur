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
}

export interface Tag {
  darkColor: string;
  hoverColor: string;
  illustrationColor: string;
  lightColor: string;
  name: string;
  short: string;
  icon: string;
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
  tags: Tag[];
  titreInformatif: string;
  titreMarque: string;
  traductions: ObjectId[];
  typeContenu: "dispositif" | "demarche";
  updatedAt: Moment;
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

export interface Structure {
  _id: ObjectId;
  membres: { userId: ObjectId; roles: string[] }[];
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
}

export interface SimplifiedStructure {
  _id: ObjectId;
  acronyme: string;
  nom: string;
  picture: Picture;
}

export interface Picture {
  imgId: string | null;
  public_id: string | null;
  secure_url: string | null;
}
export interface Translation {
  _id?: ObjectId;
  initialText?: object;
  translatedText?: object;
  langueCible?: string;
  articleId?: ObjectId;
  timeSpent?: string;
  isStructure?: boolean;
  avancement?: number;
  type?: string;
  validatorId?: ObjectId;
  isExpert?: boolean;
}
