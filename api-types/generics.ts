import { Types } from "mongoose";

/**
 *  @see https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript
 */
export type ExcludeMethods<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]>;
export type Id = ExcludeMethods<string | Types.ObjectId>;

export type Uuid = string;
export type RichText = string;
export type TranslatedText = { [key: string]: string };
export type Languages = "fr" | "en" | "uk" | "ti" | "ar" | "ps" | "ru" | "fa";

/**
 * @pattern [0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}
 */
export type AppUserUid = string;

export interface Picture {
  imgId: string | null;
  public_id: string | null;
  secure_url: string;
}

// Theme
export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}

export interface SimpleTheme {
  _id: Id;
  name: TranslatedText;
  short: TranslatedText;
  colors: ThemeColors;
  position: number;
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  notificationEmoji: string;
  adminComments?: string;
}

// Structure
export enum StructureStatus {
  ACTIVE = "Actif",
  WAITING = "En attente",
  DELETED = "Supprimé",
}

export interface UserStructure {
  _id: Id;
  nom: string;
  picture: Picture;
  role: string[];
}

export interface ContentStructure {
  _id: Id;
  nom: string;
  picture: Picture;
  status?: string;
}

export interface Sponsor {
  name: string;
  logo: Picture;
  link: string;
}

// User
export enum UserStatus {
  ACTIVE = "Actif",
  DELETED = "Exclu",
}

export interface SimpleUser {
  _id: Id;
  username: string;
  picture: Picture | undefined;
  email: string | undefined;
  roles?: string[];
}

export interface StructureMember {
  userId: string;
  username: string;
  picture: Picture;
  last_connected: Date;
  roles: string[];
  added_at: Date;
  mainRole: string;
}

// Dispositif
export enum ContentType {
  DISPOSITIF = "dispositif",
  DEMARCHE = "demarche",
}

export enum DispositifStatus {
  ACTIVE = "Actif",
  DRAFT = "Brouillon",
  DELETED = "Supprimé",
  WAITING = "En attente",
  WAITING_ADMIN = "En attente admin",
  NO_STRUCTURE = "En attente non prioritaire",
  OK_STRUCTURE = "Accepté structure",
  KO_STRUCTURE = "Rejeté structure",
}

export interface InfoSection {
  title: string;
  text: RichText;
}
export type InfoSections = Record<string, InfoSection>;

export type locationType = "france" | "online" | string[];
export type frenchLevelType = "A1.1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ageType = "lessThan" | "moreThan" | "between";
export type priceDetails = "once" | "eachTime" | "hour" | "day" | "week" | "month" | "trimester" | "semester" | "year";
export type publicStatusType = "asile" | "refugie" | "subsidiaire" | "temporaire" | "apatride" | "french";
export type publicType = "family" | "women" | "youths" | "senior";
export type conditionType = "acte naissance" | /* "diplome" | */ "titre sejour" /* | "domicile" */ | "cir" | "bank account" | "pole emploi" | "driver license";
export type commitmentDetailsType = "minimum" | "maximum" | "approximately" | "exactly" | "between";
export type frequencyDetailsType = "minimum" | "maximum" | "approximately" | "exactly";
export type timeUnitType = "hours" | "days" | "weeks" | "months" | "trimesters" | "semesters" | "years";
export type frequencyUnitType = "day" | "week" | "month" | "trimester" | "semester" | "year";
export type timeSlotType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface Poi {
  title: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  description?: string;
  email?: string;
  phone?: string;
}

export interface Metadatas {
  location?: locationType | null;
  frenchLevel?: frenchLevelType[] | null;
  publicStatus?: publicStatusType[] | null;
  public?: publicType[] | null;
  conditions?: conditionType[] | null;
  timeSlots?: timeSlotType[] | null;
  age?: {
    type: ageType;
    ages: number[];
  } | null;
  price?: {
    values: number[];
    details?: priceDetails | null;
  } | null;
  commitment?: {
    amountDetails: commitmentDetailsType;
    hours: number[];
    timeUnit: timeUnitType;
  } | null;
  frequency?: {
    amountDetails: frequencyDetailsType;
    hours: number;
    timeUnit: timeUnitType;
    frequencyUnit: frequencyUnitType;
  } | null;

  // TODO: delete
  duration?: string;
  important?: string;
}

export interface SimpleDispositif {
  _id: Id;
  titreInformatif?: string;
  titreMarque?: string;
  abstract?: string;
  typeContenu: ContentType;
  status: DispositifStatus;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  metadatas: Metadatas;
  created_at?: Date;
  publishedAt?: Date;
  lastModificationDate?: Date;
  nbMots: number;
  nbVues: number;
  nbVuesMobile: number;
  mainSponsor?: {
    nom: string;
    picture: Picture;
  };
  availableLanguages: string[];
}
