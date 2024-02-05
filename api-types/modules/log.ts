import { Id } from "../generics";

/**
 * @url GET /logs
 */
export interface GetLogResponse {
  _id: Id;
  objectId: Id;
  model_object: "User" | "Dispositif" | "Structure";
  text: string;
  author: { email: string, username?: string };
  dynamicId?: {
    nom?: string
    username?: string
    titreInformatif?: string
    langueFr?: string
  };
  model_dynamic?: "User" | "Dispositif" | "Structure" | "Langue";
  link?: {
    id: Id;
    model_link: "User" | "Dispositif" | "Structure";
    next:
    | "ModalContenu"
    | "ModalStructure"
    | "ModalUser"
    | "ModalReaction"
    | "ModalImprovements"
    | "ModalNeeds"
    | "PageAnnuaire";
  }
  created_at: Date
}
