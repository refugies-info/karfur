import { Moment } from "moment";

export type ObjectId = any;

export interface Picture {
  secure_url: string;
  public_id: string;
  imgId: string;
}
export interface Language {
  langueFr: string;
  i18nCode: string;
  _id: ObjectId;
  avancementTrad: number;
}

export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}

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
  colors: ThemeColors;
  position: number;
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  active: boolean;
  notificationEmoji: string;
  created_at?: Moment;
}
export interface SimplifiedContent {
  _id: ObjectId;
  titreInformatif: string;
  titreMarque?: string;
  theme: Theme;
  secondaryThemes: Theme[];
  needs?: ObjectId[];
  typeContenu: "dispositif" | "demarche";
  nbVues: number;
  sponsorUrl: string | null;
  avancement: number | Record<AvailableLanguageI18nCode, string>;
}

export type AvailableLanguageI18nCode =
  | "fr"
  | "en"
  | "ps"
  | "ar"
  | "ti"
  | "ru"
  | "fa"
  | "uk";

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
  markers?: MarkerGoogle[];
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

export interface Sponsor {
  picture?: { secure_url: string };
  nom: string;
}
export interface Content {
  _id: ObjectId;
  avancement: Record<string, number>;
  contenu: DispositifContent[];
  externalLink: string;
  mainSponsor: Sponsor;
  theme: Theme;
  secondaryThemes: Theme[];
  titreInformatif: string;
  titreMarque: string;
  typeContenu: "dispositif" | "demarche";
  lastModificationDate: Moment | null;
  nbVuesMobile?: number;
  nbFavoritesMobile?: number;
}

export interface MarkerGoogle {
  address?: string;
  email?: string;
  latitude: number;
  longitude: number;
  nom: string;
  telephone?: string;
  vicinity: string;
  description?: string;
  place_id: string;
}

export interface MapGoogle {
  markers: MarkerGoogle[];
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
  theme: ObjectId;
  position?: number;
  created_at: Moment;
  updatedAt: Moment;
}

export interface ReadingItem {
  id: string
  posX: number
  posY: number
  text: string
}