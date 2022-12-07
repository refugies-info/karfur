import { ObjectId } from "mongodb";
import { Moment } from "moment";

export interface RequestReturn<Y> {
  data: { data: Y };
}

export interface Event {
  target: { id: string; value: string };
}

export interface Indicator {
  _id: ObjectId;
  wordsCount: number;
  timeSpent: number;
}

export interface Picture {
  imgId: string;
  public_id: string;
  secure_url: string;
}

type iconName = "house" |
  "search" |
  "message" |
  "menu" |
  "tag" |
  "";
export interface Theme {
  _id: ObjectId;
  name: {
    fr: string;
    [key: string]: string;
  };
  short: {
    fr: string;
    [key: string]: string;
  };
  colors: {
    color100: string;
    color80: string;
    color60: string;
    color40: string;
    color30: string;
  }
  position: number;
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  notificationEmoji: string;
  adminComments: string;
  active: boolean;
  created_at?: Moment;
}

export interface SimplifiedStructure {
  _id: ObjectId;
  acronyme: string;
  nom: string;
  structureTypes?: string[];
  departments?: string[];
  picture: Picture | null;
  role?: string[];
  disposAssociesLocalisation?: string[];
}

export interface UiObject {
  accordion: boolean;
  addDropdown: boolean;
  cardDropdown: boolean;
  isHover: boolean;
  varianteSelected: boolean;
  children: any
}

export interface SimplifiedUser {
  username: string;
  picture: Picture;
  status: string;
  _id: ObjectId;
  created_at?: Moment;
  roles?: string[];
  email: string;
  phone?: string;
  langues?: { langueCode: string; langueFr: string }[];
  structures?: SimplifiedStructure[];
  nbStructures?: number;
  threeMonthsIndicator?: Indicator;
  sixMonthsIndicator?: Indicator;
  twelveMonthsIndicator?: Indicator;
  totalIndicator?: Indicator;
  adminComments?: string;
}

export interface SimplifiedCreator {
  username: string;
  picture: Picture | undefined;
  _id: ObjectId;
  email: string | undefined;
  roles?: string[]
}

export interface SimplifiedMainSponsor {
  _id: ObjectId;
  nom: string;
  status: string;
  picture: Picture | null;
}
export interface SimplifiedDispositif {
  titreInformatif: string;
  titreMarque?: string;
  updatedAt: Moment;
  status: string;
  typeContenu: string;
  created_at: Moment;
  publishedAt?: Moment;
  publishedAtAuthor?: {
    _id: ObjectId
    username: string
  }
  _id: ObjectId;
  mainSponsor: null | SimplifiedMainSponsor;
  creatorId: SimplifiedCreator | null;
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
  lastAdminUpdate?: Moment;
  lastReminderMailSentToUpdateContentDate?: Moment;
  draftReminderMailSentDate?: Moment;
  draftSecondReminderMailSentDate?: Moment;
  lastModificationDate?: Moment;
  lastModificationAuthor?: {
    _id: ObjectId
    username: string
  }
  needs?: ObjectId[];
  theme: Theme;
  secondaryThemes: Theme[];
  nbMercis: number;
  nbVues: number;
  themesSelectedByAuthor?: boolean
}

export interface Role {
  _id: ObjectId;
  nom: string;
  nomPublique: string;
}

export interface Language {
  langueFr: string;
  langueLoc: string;
  langueCode: string;
  i18nCode: string;
  _id?: ObjectId;
  avancement: number;
  avancementTrad?: number;
}

export interface UserLanguage {
  langueFr: string;
  langueLoc: string;
  langueCode: string;
  i18nCode: string;
  _id: ObjectId;
}

export interface DispositifPinned {
  _id: string
  datePin: Moment
}

export interface User {
  username: string;
  email?: string;
  phone?: string;
  code?: string;
  description?: string;
  objectifTemps?: number;
  objectifMots?: number;
  picture?: Picture;
  roles?: Role[];
  selectedLanguages?: UserLanguage[];
  notifyObjectifs?: boolean;
  objectifTempsContrib?: number;
  objectifMotsContrib?: number;
  notifyObjectifsContrib?: boolean;
  traductionsFaites?: ObjectId[];
  contributions?: ObjectId[];
  noteTraduction?: number;
  status?: string;
  cookies?: {
    dispositifsPinned?: DispositifPinned[]
  };
  structures?: ObjectId[];
  last_connected?: Moment;
  updatedAt: Moment;
  created_at: Moment;
  _id: ObjectId;
}

export interface DispositifContent {
  type?: string;
  title?: string;
  content?: string | null;
  editable?: boolean;
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
  editorState?: any;
  isMapLoaded?: boolean;
  papiers?: any[];
  duree?: string;
  delai?: string;
  timeStepDuree?: string;
  timeStepDelai?: string;
  tooltipFooter?: string;
  option?: any;
  markers?: any[];
}

interface Membre {
  userId: ObjectId;
  roles: string[];
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
  membres: Membre[];
  acronyme: string;
  administrateur: ObjectId;
  adresse: string;
  authorBelongs: boolean;
  contact: string;
  created_at: Moment;
  createur: ObjectId;
  // eslint-disable-next-line no-use-before-define
  dispositifsAssocies: ObjectId[] | SearchDispositif[];
  link: string;
  mail_contact: string;
  mail_generique: string;
  nom: string;
  phone_contact: string;
  siren: string;
  siret: string;
  status: string;
  updatedAt: Moment;
  picture: Picture | null;
  structureTypes?: string[];
  websites?: string[];
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  activities?: string[];
  departments?: string[];
  phonesPublic?: string[];
  adressPublic?: string;
  openingHours?: OpeningHours;
  onlyWithRdv?: boolean;
  description?: string;
  hasResponsibleSeenNotification?: boolean;
  mailsPublic?: string[];
  alt?: string;
}

export interface AudienceAge {
  contentTitle: "Plus de ** ans" | "De ** à ** ans" | "Moins de ** ans";
  bottomValue: number | string;
  topValue: number | string;
}
export interface SearchDispositif {
  _id: ObjectId;
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
  audienceAge: AudienceAge[];
  avancement: Record<string, number>;
  contenu: DispositifContent[];
  created_at: Moment;
  mainSponsor: SimplifiedMainSponsor;
  nbMots: number;
  niveauFrancais?: string[];
  needs: ObjectId[];
  theme: ObjectId;
  status: string;
  secondaryThemes: ObjectId[];
  typeContenu: "dispositif" | "demarche";
  suggestions?: any[];
  nbMercis?: number;
  lastModificationDate?: number;
  nbVues: number;
  lastModificationDate?: number;
  publishedAt?: number;
}
export interface IDispositif {
  _id: ObjectId;
  abstract: string;
  audience: string[];
  audienceAge: AudienceAge[];
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
  niveauFrancais?: string[];
  participants: User[];
  signalements: any[];
  sponsors: Structure[];
  needs: ObjectId[];
  status: string;
  suggestions: any[];
  theme: Theme;
  secondaryThemes: Theme[];
  titreInformatif: string;
  titreMarque: string;
  typeContenu: "dispositif" | "demarche";
  updatedAt: Moment;
  nbVues: number;
  nbMercis: number;
  timeSpent?: number;
  lastModificationDate?: number;
  publishedAt?: number;
}

export interface UserStructureMembre {
  _id: ObjectId;
  roles: string[];
  picture?: Picture;
  username: string;
  last_connected?: Moment;
  added_at?: Moment;
  mainRole?: string;
}
export interface UserStructure extends Structure {
  membres: UserStructureMembre[];
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

interface SimplifiedDispositifAssocie {
  titreInformatif: string;
  titreMarque: string;
  _id: ObjectId;
  theme: Theme;
  secondaryThemes: Theme[];
  abstract: string;
  status: string;
}

export interface Responsable {
  _id: ObjectId;
  username: string;
  picture: Picture;
  email: string;
}
export interface SimplifiedStructureForAdmin {
  _id: ObjectId;
  nom: string;
  acronyme: string;
  status: string;
  picture: Picture;
  nbMembres: number;
  created_at: Moment;
  createur: null | Responsable;
  responsable: null | Responsable;
  membres: Membre[];
  dispositifsIds: ObjectId[];
  createur: null | SimplifiedCreator;
  nbFiches: number;
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
}

export interface IUserContribution {
  _id: ObjectId;
  typeContenu: "dispositif" | "demarche";
  titreInformatif: string;
  titreMarque: string;
  mainSponsor: string | null;
  nbMercis: number;
  nbVues: number;
  status: string;
}

export type TranslationStatus =
  | "À traduire"
  | "En attente"
  | "Validée"
  | "À revoir";
export interface IDispositifTranslation {
  _id: ObjectId;
  titreInformatif: string;
  titreMarque: string;
  nbMots: number;
  created_at: number;
  typeContenu: "dispositif" | "demarche";
  lastTradUpdatedAt: number | null;
  avancementTrad: number;
  avancementExpert: number;
  tradStatus: TranslationStatus;
}

export type Indicators = {
  threeMonthsIndicator?: Indicator[];
  sixMonthsIndicator?: Indicator[];
  twelveMonthsIndicator?: Indicator[];
  totalIndicator?: Indicator[];
};

export type ITypeContenu = "dispositif" | "demarche";

export interface NeedDetail {
  text: string;
  subtitle: string;
  updatedAt?: Moment;
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
  theme: Theme;
  adminComments: string;
  image: Picture;
  nbVues?: number;
  position?: number;
  created_at: Moment;
  updatedAt: Moment;
}

export interface RegionFigures {
  region: string;
  nbDispositifs: number;
  nbDepartments: number;
  nbDepartmentsWithDispo: number;
}
export interface NbDispositifsByRegion {
  regionFigures: RegionFigures[]
  dispositifsWithoutGeoloc: ObjectId[]
}
export interface Statistics {
  nbMercis: number
  nbVues: number
  nbVuesMobile: number
}

export type AvailableLanguageI18nCode =
  | "fr"
  | "en"
  | "ps"
  | "ar"
  | "ti"
  | "ru"
  | "uk"
  | "fa";

export interface Log {
  _id: ObjectId;
  objectId: ObjectId;
  model_object: "User" | "Dispositif" | "Structure";
  text: string;
  author?: {
    _id: ObjectId;
    username: string;
  }
  dynamicId?: {
    _id: ObjectId;
    nom?: string;
    titreInformatif?: string;
    username?: string;
    langueFr?: string;
  }
  model_dynamic?: "User" | "Dispositif" | "Structure" | "Langue";
  link?: {
    id: ObjectId;
    model_link: "User" | "Dispositif" | "Structure";
    next: "ModalContenu" | "ModalStructure" | "ModalUser" | "ModalReaction" | "ModalImprovements" | "ModalNeeds" | "PageAnnuaire";
  }
  created_at: Moment;
}

export type ContentType = "dispositif" | "demarche";

export interface Widget {
  _id: ObjectId;
  name: string;
  tags: string[];
  themes: Theme[];
  typeContenu: ContentType[];
  department?: string;
  languages?: string[];
  author: {
    _id: ObjectId;
    username: string;
  }
  created_at: Moment;
}

export interface AdminOption {
  _id: ObjectId;
  key: string;
  value: any;
  created_at: Moment;
}


export type Status = {
  displayedStatus: string
  color: string
  textColor?: string
}

export type ContentStatusType = "Actif" | "En attente" | "Brouillon" | "En attente non prioritaire" | "Rejeté structure" | "En attente admin" | "Accepté structure" | "Supprimé";
export type ContentStatus = {
  storedStatus: ContentStatusType
  order: number
} & Status;

export type StructureStatusType = "Actif" | "En attente" | "Supprimé";
export type StructureStatus = {
  storedStatus: StructureStatusType
  order: number
} & Status;

export type UserStatusType = "Respo" | "Admin" | "Experts" | "Traducteurs" | "Rédacteurs" | "Multi-structure" | "Tous";
export type UserStatus = {
  storedStatus: UserStatusType
  order: number
} & Status;

export type ProgressionStatus = {
  storedStatus: string
} & Status;

export type PageOptions = {
  cookiesModule: boolean
  supportModule: boolean
}
