import { ObjectId } from "mongoose";
import { Log } from "../../schema/schemaLog";
import { createLog } from "./logs.repository";

export type optionsType = {
  author?: ObjectId;
  dynamicId?: ObjectId;
  model_dynamic?: "User" | "Dispositif" | "Structure" | "Langue";
  link?: {
    id: ObjectId;
    model_link: "User" | "Dispositif" | "Structure";
    next: "ModalContenu" | "ModalStructure" | "ModalUser" | "ModalReaction" | "ModalImprovements" | "ModalNeeds" | "PageAnnuaire";
  }
}

export const addLog = (
  id: string | ObjectId,
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
}
