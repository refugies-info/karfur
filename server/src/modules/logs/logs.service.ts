import { DispositifId, LangueId, StructureId, UserId } from "src/typegoose";
import { Log } from "../../schema/schemaLog";
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
  const log = new Log({
    objectId: id,
    model_object: type,
    text,
    ...(options || {})
  });
  return createLog(log);
};
