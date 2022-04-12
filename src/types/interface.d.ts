import { Moment } from "moment";

export type ObjectId = any;
export interface Language {
  langueFr: string;
  i18nCode: string;
  _id: ObjectId;
  avancementTrad: number;
}

interface Tag {
  short: string;
  name: string;
}
interface ExpandedTag {
  short: string;
  icon: string;
  name: string;
  darkColor: string;
  lightColor: string;
  mdLightColor: string;
  veryLightColor: string;
  color30: string;
  order: number;
}
export interface SimplifiedContent {
  _id: ObjectId;
  titreInformatif: string;
  titreMarque?: string;
  tags: Tag[];
  needs?: ObjectId[];
  typeContenu: "dispositif" | "demarche";
  nbVues: number;
  sponsorUrl: string | null;
  avancement: number | Record<AvailableLanguageI18nCode, string>;
}

export interface ThemeTag {
  tagName: string;
  iconName: string;
  tagDarkColor: string;
  tagLightColor: string;
  tagVeryLightColor: string;
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
  tags: Tag[];
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
  tagName: string;
  created_at: Moment;
  updatedAt: Moment;
}
