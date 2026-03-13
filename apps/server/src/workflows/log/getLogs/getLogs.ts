import type { GetLogResponse } from "@refugies-info/api-types";
import logger from "~/logger";
import { getDispositifName } from "~/modules/dispositif/dispositif.repository";
import { getLangueName } from "~/modules/langues/langues.repository";
import { findLogs } from "~/modules/logs/logs.repository";
import { groupLogs } from "~/modules/logs/logs.service";
import { getStructureName } from "~/modules/structure/structure.repository";
import { getUserName } from "~/modules/users/users.repository";
import type { ResponseWithData } from "~/types/interface";

export const getLogs = async (id: string): ResponseWithData<GetLogResponse[]> => {
  logger.info("[getLogs] received with id", id);
  const logs = await findLogs(id);

  const allLogs: GetLogResponse[] = await Promise.all(
    logs.map(async (log) => {
      if (log.dynamicId) {
        if (log.model_dynamic === "Dispositif")
          return {
            ...(log.toObject() as any),
            dynamicId: { titreInformatif: await getDispositifName(log.dynamicId) },
          };
        if (log.model_dynamic === "Langue")
          return {
            ...(log.toObject() as any),
            dynamicId: { langueFr: await getLangueName(log.dynamicId) },
          };
        if (log.model_dynamic === "User")
          return {
            ...(log.toObject() as any),
            dynamicId: { username: await getUserName(log.dynamicId) },
          };
        if (log.model_dynamic === "Structure")
          return {
            ...(log.toObject() as any),
            dynamicId: { nom: await getStructureName(log.dynamicId) },
          };
      }
      return { ...(log.toObject() as any), dynamicId: undefined };
    }),
  );

  return {
    text: "success",
    data: groupLogs(allLogs as any),
  };
};
