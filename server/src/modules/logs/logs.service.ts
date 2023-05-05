import { GetLogResponse, Id } from "@refugies-info/api-types";
import logger from "../../logger";
import { DispositifId, LangueId, Log, StructureId, UserId, ObjectId } from "../../typegoose";
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

export const addLog = async (
  id: UserId | DispositifId | StructureId | Id,
  type: "User" | "Dispositif" | "Structure",
  text: string,
  options?: optionsType,
) => {
  const log = new Log();
  log.objectId = new ObjectId(id.toString());
  log.model_object = type;
  log.text = text;

  if (options?.author) log.author = new ObjectId(options.author.toString());
  if (options?.dynamicId) log.dynamicId = new ObjectId(options.dynamicId.toString());
  if (options?.model_dynamic) log.model_dynamic = options.model_dynamic;
  if (options?.link) log.link = { ...options.link, id: new ObjectId(options.link.id.toString()) };

  try {
    await createLog(log);
  } catch (e) {
    logger.error("[addLog] error: ", e);
    return;
  }
};

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const groupLogs = (logs: GetLogResponse[]): GetLogResponse[] => {
  return logs.reduceRight((prev, curr) => {
    if (prev.find(l => datesAreOnSameDay(l.created_at, curr.created_at) && l.author.username === curr.author.username && l.text === curr.text)) return prev;
    return [curr, ...prev];
  }, [] as GetLogResponse[]);
}
