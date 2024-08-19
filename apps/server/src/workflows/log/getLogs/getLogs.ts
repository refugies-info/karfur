import { GetLogResponse } from "@refugies-info/api-types";
import { getDispositifName } from "../../../modules/dispositif/dispositif.repository";
import { getLangueName } from "../../../modules/langues/langues.repository";
import { getStructureName } from "../../../modules/structure/structure.repository";
import { getUserName } from "../../../modules/users/users.repository";
import logger from "../../../logger";
import { findLogs } from "../../../modules/logs/logs.repository";
import { ResponseWithData } from "../../../types/interface";
import { groupLogs } from "../../../modules/logs/logs.service";

export const getLogs = async (id: string): ResponseWithData<GetLogResponse[]> => {
  logger.info("[getLogs] received with id", id);
  const logs = await findLogs(id);

  const allLogs: GetLogResponse[] = await Promise.all(logs.map(async (log) => {
    if (log.dynamicId) {
      if (log.model_dynamic === "Dispositif") return {
        ...log.toObject(),
        dynamicId: { titreInformatif: await getDispositifName(log.dynamicId) }
      }
      if (log.model_dynamic === "Langue") return {
        ...log.toObject(),
        dynamicId: { langueFr: await getLangueName(log.dynamicId) }
      }
      if (log.model_dynamic === "User") return {
        ...log.toObject(),
        dynamicId: { username: await getUserName(log.dynamicId) }
      }
      if (log.model_dynamic === "Structure") return {
        ...log.toObject(),
        dynamicId: { nom: await getStructureName(log.dynamicId) }
      }
    }
    return { ...log.toObject(), dynamicId: undefined };
  }))

  return {
    text: "success",
    data: groupLogs(allLogs),
  };
};
