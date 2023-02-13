/* TODO: share with API */

import { AxiosResponse } from "axios";
export type APIResponse<T> = AxiosResponse<{
  text: "success" | "error",
  data: T
}>

type RichText = string;
type Uuid = string;
type lnCode = string;
type frenchLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type ageType = "lessThan" | "moreThan" | "between";
type priceDetails = "une fois" | "à chaque fois" | "par heure" | "par semaine" | "par mois" | "par an";
type publicType = "refugee" | "all";
type justificatifType = "diplome" | "titre sejour" | "domicile";
type contentType = "dispositif" | "demarche";

interface Picture {
  imgId: string | null;
  public_id: string | null;
  secure_url: string | null;
}

interface InfoSection {
  title: string;
  text: string;
}

interface Sponsor {
  name: string;
  logo: string;
  link: string;
}

interface SponsorDB {
  _id: any;
  nom: string;
  picture: Picture;
}

interface Poi {
  title: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  description?: string;
  email?: string;
  phone?: string;
}

export type InfoSections = Record<string, InfoSection>;

export type GetDispositifResponse = {
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
  what: string;
  why?: InfoSections;
  how: InfoSections;
  next?: InfoSections;
  typeContenu: string;
  status: string;
  mainSponsor?: SponsorDB
  theme?: any;
  secondaryThemes?: any[];
  needs: any;
  sponsors?: (Sponsor | SponsorDB)[];
  participants: {
    _id: any;
    username: string;
    picture: Picture;
  }[];
  suggestions: any;
  merci: { created_at: Date, userId?: any }[];
  metadatas: {
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
    }
    duration?: string;
    public?: publicType;
    titreSejourRequired?: boolean;
    acteNaissanceRequired?: boolean;
    justificatif?: justificatifType;
  };
  map: Poi[];
};
