import { Id } from "api-types";
import { Types } from "mongoose";
import { DispositifId, LangueId, Log, StructureId, UserId } from "../../typegoose";
import { createLog } from "./logs.repository";

export type optionsType = {
  author?: UserId;
  dynamicId?: UserId | DispositifId | StructureId | LangueId;
  model_dynamic?: "User" | "Dispositif" | "Structure" | "Langue";
  link?: {
    id: UserId | DispositifId | StructureId;
    model_link: "User" | "Dispositif" | "Structure";
    next:
    | "ModalContenu"
    | "ModalStructure"
    | "ModalUser"
    | "ModalReaction"
    | "ModalImprovements"
    | "ModalNeeds"
    | "PageAnnuaire";
  };
};

export const addLog = (
  id: UserId | DispositifId | StructureId | Id,
  type: "User" | "Dispositif" | "Structure",
  text: string,
  options?: optionsType
) => {
  // @ts-ignore FIXME
  const log: Log = {
    objectId: new Types.ObjectId(id.toString()),
    model_object: type,
    text,
    ...(options || {})
  };
  return createLog(log);
};
