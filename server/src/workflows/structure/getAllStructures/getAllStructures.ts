import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getStructuresWithDispos } from "../../../modules/structure/structure.repository";
import { getUsersById } from "../../../modules/users/users.repository";
import { UserId } from "../../../typegoose";
import pick from "lodash/pick";
import { GetAllStructuresResponse, Id, SimpleUser } from "@refugies-info/api-types";

// type StructureStatusType = "Actif" | "En attente" | "Supprimé";

export const getAllStructures = async (): ResponseWithData<GetAllStructuresResponse[]> => {
  logger.info("[getAllStructures] received");
  const neededFields = {
    nom: 1,
    acronyme: 1,
    status: 1,
    picture: 1,
    dispositifsAssocies: 1,
    created_at: 1,
    createur: 1,
    membres: 1,
    adminComments: 1,
    adminProgressionStatus: 1,
    adminPercentageProgressionStatus: 1,
  };

  const structures = await getStructuresWithDispos({}, neededFields);

  const simplifiedStructures: (Omit<GetAllStructuresResponse, "responsable"> & { responsable: Id | null })[] =
    structures.map((structure) => {
      const nbMembres = structure.membres?.length || 0;
      const dispositifsIds = structure.dispositifsAssocies.map((d) => d._id);
      const dispositifsAssocies = structure.dispositifsAssocies.filter(
        (d) => d.status && !["Supprimé", "Brouillon"].includes(d.status),
      );
      const nbFiches = dispositifsAssocies.length;
      const responsablesArray = structure.membres
        ? structure.membres.filter((user) => user.roles && user.userId && user.roles.includes("administrateur"))
        : [];
      const responsableId = responsablesArray.length > 0 ? responsablesArray[0].userId : null;

      return {
        _id: structure._id,
        nom: structure.nom || "",
        membres: structure.membres || [],
        createur: structure.createur || null,
        nbMembres,
        nbFiches,
        dispositifsIds,
        responsable: responsableId?.toString() || null,
        ...pick(structure, [
          "nom",
          "acronyme",
          "status",
          "picture",
          "created_at",
          "adminComments",
          "adminProgressionStatus",
          "adminPercentageProgressionStatus",
        ]),
      };
    });

  const data: GetAllStructuresResponse[] = [];
  // for performances purposes, get all responsables at once
  const responsablesIDs = simplifiedStructures.map((structure) => structure.responsable).filter((_) => !!_);
  if (responsablesIDs.length) {
    const responsables: Record<string, SimpleUser> = await getUsersById(responsablesIDs as UserId[], {
      _id: 1,
      username: 1,
      picture: 1,
      email: 1,
    }).then((users) =>
      users.reduce((acc: { [key: string]: SimpleUser }, user) => ({ ...acc, [user._id.toString()]: user }), {}),
    );

    // and rebuild structures with responsable informations
    simplifiedStructures.map((structure) => {
      if (structure.responsable) {
        const responsable = responsables[structure.responsable.toString()];
        return data.push({ ...structure, responsable });
      }
      return data.push({ ...structure, responsable: null });
    });
  } else {
    simplifiedStructures.map((structure) => data.push({ ...structure, responsable: null }));
  }

  return { text: "success", data };
};
