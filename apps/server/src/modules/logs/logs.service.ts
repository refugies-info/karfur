import { GetLogResponse, Id } from "@refugies-info/api-types";
import isEmpty from "lodash/isEmpty";
import logger from "~/logger";
import { DispositifId, LangueId, Log, ObjectId, StructureId, UserId } from "~/typegoose";
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

const sameDynamicIds = (first: GetLogResponse["dynamicId"], second: GetLogResponse["dynamicId"]) => {
  if (
    (isEmpty(first) && isEmpty(second)) ||
    (first.langueFr && second.langueFr && first.langueFr === second.langueFr) ||
    (first.nom && second.nom && first.nom === second.nom) ||
    (first.titreInformatif && second.titreInformatif && first.titreInformatif === second.titreInformatif) ||
    (first.username && second.username && first.username === second.username)
  ) {
    return true;
  }
  return false;
};

export const groupLogs = (logs: GetLogResponse[]): GetLogResponse[] => {
  return logs.reduceRight((prev, curr) => {
    if (
      prev.find(
        (l) =>
          datesAreOnSameDay(l.created_at, curr.created_at) &&
          l.author?.username === curr.author?.username &&
          l.text === curr.text &&
          sameDynamicIds(l.dynamicId, curr.dynamicId),
      )
    )
      return prev;
    return [curr, ...prev];
  }, [] as GetLogResponse[]);
};
