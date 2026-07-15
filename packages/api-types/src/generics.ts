import type { Types } from "mongoose";

/**
 *  @see https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript
 */
export type ExcludeMethods<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : K }[keyof T]
>;
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

export enum RoleName {
  ADMIN = "Admin",
  EXPERT_TRAD = "ExpertTrad",
  TRAD = "Trad",
  CONTRIB = "Contrib",
  CAREGIVER = "Aidant",
  STRUCTURE = "hasStructure",
  USER = "User",
  NEWSLETTER = "Newsletter",
}

// Theme
export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}

export interface ThemeGradientColors {
  colorTop: string;
  colorBottom: string;
}

export interface SimpleTheme {
  _id: Id;
  name: TranslatedText;
  short: TranslatedText;
  mainColor: string;
  colors: ThemeColors;
  gradientColors: ThemeGradientColors;
  position: number;
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  dispositifImage: Picture;
  demarcheImage: Picture;
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
  picture?: Picture;
  status?: string;
  link?: string;
  acronyme?: string;
}

export interface MainSponsor {
  name: string;
  nom?: string;
  logo?: Picture;
  link?: string;
  acronyme?: string;
}

export interface Sponsor {
  name: string;
  // Unfortunately there are occurrences in the database with a null logo
  // See https://linear.app/refugiesinfo/issue/RI-794/bug-erreur-lors-de-la-sauvegarde-automatique-dun-fiche
  logo?: Picture | null;
  link?: string | null;
}

export interface DemarcheAdministration {
  name?: string | null;
  logo?: Picture | null;
}

// User
export enum UserStatus {
  ACTIVE = "Actif",
  DELETED = "Exclu",
}

export interface SimpleUser {
  _id: Id;
  email?: string;
  username?: string;
  picture?: Picture;
  roles?: string[];
}

export interface StructureMember {
  userId: string;
  username?: string;
  email?: string;
  picture: Picture;
  last_connected: Date;
  added_at: Date;
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
  WAITING_STRUCTURE = "En attente",
  WAITING_ADMIN = "En attente admin",
  UPDATE_TO_VALIDATE = "Mise à jour à valider", // applicable only for drafts
  OK_STRUCTURE = "Accepté structure",
  KO_STRUCTURE = "Rejeté structure",
  ARCHIVED = "Archivé",
}

// Dispositif origin type for distinguishing editorial vs AI-generated content
export enum DispositifOrigin {
  RI = "RI",
  RCO = "RCO",
}

export interface InfoSection {
  title: string;
  text: RichText;
}
export type InfoSections = Record<string, InfoSection>;

export type locationType = "france" | "online" | string[];
export type frenchLevelType = "alpha" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ageType = "lessThan" | "moreThan" | "between";
export type priceDetails =
  | "once"
  | "eachTime"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "trimester"
  | "semester"
  | "year";
export type publicStatusType =
  | "asile"
  | "refugie"
  | "subsidiaire"
  | "temporaire"
  | "apatride"
  | "french";
export type publicType = "family" | "women" | "youths" | "senior" | "gender";
export type conditionType =
  | "acte naissance"
  | "titre sejour"
  | "cir"
  | "bank account"
  | "pole emploi"
  | "driver license"
  | "school";
export type commitmentDetailsType = "minimum" | "maximum" | "approximately" | "exactly" | "between";
export type frequencyDetailsType = "minimum" | "maximum" | "approximately" | "exactly";
export type timeUnitType =
  | "sessions"
  | "hours"
  | "half-days"
  | "days"
  | "weeks"
  | "months"
  | "trimesters"
  | "semesters"
  | "years";
export type frequencyUnitType =
  | "session"
  | "day"
  | "week"
  | "month"
  | "trimester"
  | "semester"
  | "year";
export type timeSlotType =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Poi {
  title: string;
  address: string;
  city?: string | null;
  lat: number;
  lng: number;
  description?: string;
  email?: string;
  phone?: string;
}

export interface Session {
  startDate: Date;
  endDate: Date;
  registrationStartDate?: Date;
  registrationEndDate?: Date;
  externalRef?: string;
  url?: string;
}

export interface SessionsMetadata {
  modalitesEntreesSorties?: 0 | 1 | null;
  items?: Session[] | null;
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
  sessions?: SessionsMetadata | null;
}

export interface SimpleDispositif {
  _id: Id;
  titreInformatif?: string;
  titreMarque?: string | null;
  abstract?: string;
  typeContenu: ContentType;
  status: DispositifStatus;
  theme?: Id;
  secondaryThemes?: Id[];
  needs?: Id[];
  metadatas?: Metadatas;
  created_at?: Date;
  publishedAt?: Date;
  lastModificationDate?: Date;
  nbMots: number;
  nbVues: number;
  nbVuesMobile: number;
  sponsor?: {
    nom: string;
    picture?: Picture;
  };
  availableLanguages: string[];
  hasDraftVersion: boolean;
  themeSortIndex: number;
  origin: DispositifOrigin;
}
