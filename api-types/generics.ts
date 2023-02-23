import { Types } from "mongoose";

/**
 *  @see https://stackoverflow.com/questions/55479658/how-to-create-a-type-excluding-instance-methods-from-a-class-in-typescript
 */
export type ExcludeMethods<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]>;
export type Id = ExcludeMethods<string | Types.ObjectId>;

export type TranslatedText = { [key: string]: string };

export interface Picture {
  imgId: string | null;
  public_id: string | null;
  secure_url: string | null;
}

export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}

export interface Theme {
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
  logo: string;
  link: string;
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

export interface InfoSection {
  title: string;
  text: string;
}
export type InfoSections = Record<string, InfoSection>;


type frenchLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type ageType = "lessThan" | "moreThan" | "between";
type priceDetails = "une fois" | "à chaque fois" | "par heure" | "par semaine" | "par mois" | "par an";
type publicType = "refugee" | "all";
type justificatifType = "diplome" | "titre sejour" | "domicile";

export interface Metadatas {
  location?: string[];
  frenchLevel?: frenchLevel[];
  important?: string;
  age?: {
    type: ageType;
    ages: number[];
  };
  price?: {
    value: number;
    details?: priceDetails;
  };
  duration?: string;
  public?: publicType;
  titreSejourRequired?: boolean;
  acteNaissanceRequired?: boolean;
  justificatif?: justificatifType;
}

export interface SimpleDispositif {
  _id: Id;
  titreInformatif?: string;
  titreMarque?: string;
  abstract?: string;
  typeContenu: string;
  status: string;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  metadatas: Metadatas;
  created_at?: Date;
  publishedAt?: Date;
  lastModificationDate?: Date;
  nbMots: number;
  nbVues: number;
  mainSponsor?: {
    nom: string;
    picture: Picture
  }
}
