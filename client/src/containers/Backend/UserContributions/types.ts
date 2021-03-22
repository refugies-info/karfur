import { ObjectId } from "mongodb";

export interface FormattedUserContribution {
  titreInformatif: string;
  titreMarque?: string;
  typeContenu: "dispositif" | "demarche";
  nbMercis: number;
  nbVues: number;
  responsabilite: string | null;
  _id: ObjectId;
  status: string;
  mainSponsor?: string | null;
  isAuthorizedToDelete: boolean;
}
