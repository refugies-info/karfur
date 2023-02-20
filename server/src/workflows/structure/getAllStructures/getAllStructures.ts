import { Id, Picture, ResponseWithData, SimpleUser } from "../../../types/interface";
import logger from "../../../logger";
import { getStructuresFromDB } from "../../../modules/structure/structure.repository";
import { getUsersById } from "../../../modules/users/users.repository";
import { Dispositif, DispositifId, Structure, User, UserId } from "../../../typegoose";

type StructureStatusType = "Actif" | "En attente" | "Supprimé";
interface Membre {
  userId: Id;
  roles: string[];
}

export interface GetAllStructuresResponse {
  _id: Id;
  nom: string;
  acronyme: string;
  status: string;
  picture: Picture;
  nbMembres: number;
  created_at: Date;
  createur: null | SimpleUser;
  responsable: null | SimpleUser;
  membres: Membre[];
  dispositifsIds: Id[];
  nbFiches: number;
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
}

export const getAllStructures = async (): ResponseWithData<GetAllStructuresResponse[]> => {
  logger.info("[getAllStructures] get structures ");
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
    adminPercentageProgressionStatus: 1
  };
  logger.info("[getAllStructures] structures fetched");

  /* FIXME RangeError
  const structures = await getStructuresFromDB({}, neededFields, true);
  const simplifiedStructures = structures.map((structure) => {
    const jsonStructure = structure.toJSON() as Structure;
    const nbMembres = jsonStructure.membres?.length || 0;
    const responsablesArray = jsonStructure.membres
      ? jsonStructure.membres.filter((user) => user.roles && user.userId && user.roles.includes("administrateur"))
      : [];
    const responsableId = responsablesArray.length > 0 ? responsablesArray[0].userId : null;

    const dispositifsIds: DispositifId[] = jsonStructure.dispositifsAssocies.map(
      (dispositif: DispositifId | Dispositif) => (dispositif as Dispositif)._id
    );

    const dispositifsAssocies = jsonStructure.dispositifsAssocies.filter((dispo: any) => {
      return dispo.status && !["Supprimé", "Brouillon"].includes(dispo.status);
    });
    const nbFiches = dispositifsAssocies.length;

    delete jsonStructure.dispositifsAssocies;
    return {
      ...jsonStructure,
      nbMembres,
      responsable: responsableId,
      nbFiches,
      dispositifsIds
    };
  });
  const neededFieldsUser = { _id: 1, username: 1, picture: 1, email: 1 };
  const data: any = [];
  const responsablesIDs = simplifiedStructures.map((structure) => structure.responsable).filter((_) => !!_);
  if (responsablesIDs.length) {
    const responsables: Record<string, User> = await getUsersById(responsablesIDs as UserId[], neededFieldsUser).then(
      (users) => users.reduce((acc: { [key: string]: any }, user) => ({ ...acc, [user._id.toString()]: user }), {})
    );

    simplifiedStructures.map((structure) => {
      if (structure.responsable) {
        const responsable = responsables[structure.responsable.toString()];
        return data.push({ ...structure, responsable });
      }
      return data.push({ ...structure, responsable: null });
    });
  } else {
    simplifiedStructures.map((structure) => data.push({ ...structure, responsable: null }));
  } */

  return { text: "success", data: [] };
};
