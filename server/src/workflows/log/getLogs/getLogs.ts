import logger from "../../../logger";
import { findLogs } from "../../../modules/logs/logs.repository";
import { ResponseWithData } from "../../../types/interface";

export interface GetLogResponse {
  objectId: any; // FIXME: how to type an ObjectID here?
  model_object: "User" | "Dispositif" | "Structure";
  text: string;
  author: string;
  dynamicId?: string;
  model_dynamic?: "User" | "Dispositif" | "Structure" | "Langue";
  link?: {
    id: any; // FIXME: how to type an ObjectID here?
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
}

export const getLogs = async (id: string): ResponseWithData<GetLogResponse[]> => {
  logger.info("[getLogs] received with id", id);
  const logs = await findLogs(id);

  return {
    text: "success",
    data: logs
  };
}
