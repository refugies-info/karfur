import {
  type GetStructureStatisticsRequest,
  type GetStructureStatisticsResponse,
  RoleName,
} from "@refugies-info/api-types";
import logger from "~/logger";
import { getNbStructures, getStructuresFromDB } from "~/modules/structure/structure.repository";
import { findAllRespo } from "~/modules/structure/structure.service";
import { getUsersForTranslationStats, hasRole } from "~/modules/users/users.repository";
import type { ResponseWithData } from "~/types/interface";

export const getStatistics = async (
  query: GetStructureStatisticsRequest,
): ResponseWithData<GetStructureStatisticsResponse> => {
  logger.info("[getStatistics] structure");

  const noFacet = !query.facets?.length;
  const facets = query.facets || [];
  const data: GetStructureStatisticsResponse = {};

  // nbStructures
  if (noFacet || facets.includes("nbStructures")) {
    const resNbStructures: number = await getNbStructures();
    data.nbStructures = resNbStructures;
  }

  // nbCDA
  if (noFacet || facets.includes("nbCDA")) {
    const cda = await getStructuresFromDB(
      { nom: "Comité de la Démarche Accessible" },
      { membres: 1 },
    );
    data.nbCDA = cda[0]?.membres?.length ?? 0;
  }

  // nbStructureAdmins
  if (noFacet || facets.includes("nbStructureAdmins")) {
    const structures = await getStructuresFromDB({ status: "Actif" }, { membres: 1 });
    const structureAdmins = findAllRespo(structures);
    data.nbStructureAdmins = structureAdmins.length;
  }

  // nbDispositifPorteurs — union dédoublonnée des rédacteurs (rôle CONTRIB) et des
  // membres des structures actives. Évite le double comptage d'un utilisateur qui
  // est à la fois rédacteur et membre d'une structure.
  if (noFacet || facets.includes("nbDispositifPorteurs")) {
    const [structures, users] = await Promise.all([
      getStructuresFromDB({ status: "Actif" }, { membres: 1 }),
      getUsersForTranslationStats(),
    ]);
    const structureMemberIds = findAllRespo(structures);
    const redactorIds = users
      .filter((user) => hasRole(user, RoleName.CONTRIB))
      .map((user) => user._id.toString());
    data.nbDispositifPorteurs = new Set([...structureMemberIds, ...redactorIds]).size;
  }

  return {
    text: "success",
    data,
  };
};
