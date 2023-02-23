import { AxiosResponse } from "axios";
import { DispositifStatus, GetDispositifResponse, GetDispositifsResponse, Id } from "api-types";

export type APIResponse<T = null> = AxiosResponse<{
  text: "success" | "error";
  data: T;
}>;

export interface Event {
  target: { id: string; value: string };
}

export interface Indicator {
  _id: Id;
  wordsCount: number;
  timeSpent: number;
}

type iconName = "house" | "search" | "message" | "menu" | "tag" | "";
/**
 * @deprecated
 */
export interface DetailedOpeningHours {
  day: string;
  from0?: string;
  to0?: string;
  from1?: string;
  to1?: string;
}
/**
 * @deprecated
 */
export interface OpeningHours {
  details: DetailedOpeningHours[];
  noPublic: boolean;
  precisions?: string;
}

export interface Translation {
  _id?: Id;
  initialText?: object;
  translatedText?: object;
  langueCible?: string;
  articleId?: Id;
  timeSpent?: string;
  isStructure?: boolean;
  avancement?: number;
  type?: string;
  validatorId?: Id;
  isExpert?: boolean;
}

export type TranslationStatus = "À traduire" | "En attente" | "Validée" | "À revoir";
export interface IDispositifTranslation {
  _id: string;
  titreInformatif: string;
  titreMarque: string;
  nbMots: number;
  created_at: number;
  type: "dispositif" | "demarche";
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

export interface RegionFigures {
  region: string;
  nbDispositifs: number;
  nbDepartments: number;
  nbDepartmentsWithDispo: number;
}
export interface NbDispositifsByRegion {
  regionFigures: RegionFigures[];
  dispositifsWithoutGeoloc: Id[];
}

export type TranslationFacets = "nbTranslators" | "nbRedactors" | "nbWordsTranslated" | "nbActiveTranslators";
export interface TranslationStatistics {
  nbTranslators?: number;
  nbRedactors?: number;
  nbWordsTranslated?: number;
  nbActiveTranslators?: {
    languageId: string;
    count: number;
  }[];
}

export type AvailableLanguageI18nCode = "fr" | "en" | "ps" | "ar" | "ti" | "ru" | "uk" | "fa";

export type ContentType = "dispositif" | "demarche";

export type Status = {
  displayedStatus: string;
  color: string;
  textColor?: string;
};

export type ContentStatus = {
  storedStatus: DispositifStatus;
  order: number;
} & Status;

type StructureStatusType = "Actif" | "En attente" | "Supprimé";
export type StructureStatus = {
  storedStatus: StructureStatusType;
  order: number;
} & Status;

export type UserStatusType = "Respo" | "Admin" | "Experts" | "Traducteurs" | "Rédacteurs" | "Multi-structure" | "Tous";
export type UserStatus = {
  storedStatus: UserStatusType;
  order: number;
} & Status;

export type ProgressionStatus = {
  storedStatus: string;
} & Status;

export type PageOptions = {
  cookiesModule: boolean;
  supportModule: boolean;
};
