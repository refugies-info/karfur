import logger from "../../../logger";
import { findLogs } from "../../../modules/logs/logs.repository";
import { Id, ResponseWithData } from "../../../types/interface";

export interface GetLogResponse {
  _id: Id;
  objectId: Id;
  model_object: "User" | "Dispositif" | "Structure";
  text: string;
  author: { username: string };
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

export const getLogs = async (id: string): ResponseWithData<GetLogResponse[]> => {
  logger.info("[getLogs] received with id", id);
  const logs = await findLogs(id);

  return {
    text: "success",
    //@ts-ignore FIXME : created_at not available
    data: logs
  };
}
