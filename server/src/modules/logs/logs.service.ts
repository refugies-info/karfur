import { Types } from "mongoose";
import { DispositifId, LangueId, Log, StructureId, UserId } from "src/typegoose";
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
  id: UserId | DispositifId | StructureId,
  type: "User" | "Dispositif" | "Structure",
  text: string,
  options?: optionsType
) => {
  // @ts-ignore FIXME
  const log: Log = {
    objectId: new Types.ObjectId(id),
    model_object: type,
    text,
    ...(options || {})
  };
  return createLog(log);
};
