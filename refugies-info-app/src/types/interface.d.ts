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
export interface SimplifiedContent {
  _id: ObjectId;
  titreInformatif: string;
  titreMarque?: string;
  tags: Tag[];
}

export type AvailableLanguageI18nCode =
  | "fr"
  | "en"
  | "ps"
  | "ar"
  | "ti-ER"
  | "ru"
  | "fa";

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

export interface Content {
  _id: ObjectId;
  abstract: string;
  autoSave: boolean;
  avancement: Record<string, number>;
  contact: string;
  contenu: DispositifContent[];
  created_at: Moment;
  externalLink: string;
  mainSponsor: any;
  tags: Tag[];
  titreInformatif: string;
  titreMarque: string;
  traductions: ObjectId[];
  typeContenu: "dispositif" | "demarche";
  updatedAt: Moment;
  nbVues: number;
  nbMercis: number;
  lastModificationDate: Moment | null;
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
}

export interface MapGoogle {
  markers: MarkerGoogle[];
}
