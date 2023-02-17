import pick from "lodash/pick";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { Structure, UserId } from "../../../typegoose";
import { Id, Picture, ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";

interface UserStructure {
  _id: Id,
  nom: string,
  picture: Picture,
  role: string[]
}

export interface GetAllUsersResponse {
  _id: Id;
  username: string;
  picture?: Picture;
  status?: string;
  created_at?: Date;
  roles?: string[];
  email?: string;
  phone?: string;
  selectedLanguages?: { langueCode: string; langueFr: string }[];
  structures?: UserStructure[];
  nbStructures: number;
  nbContributions: number;
  adminComments?: string;
}

const getRole = (membres: Structure["membres"], userId: UserId) => {
  const isAdmin =
    membres.find(
      (membre) => membre.userId.toString() === userId.toString() && membre.roles.includes("administrateur")
    );
  if (isAdmin) return ["Responsable"];

  const isContrib =
    membres.find(
      (membre) => membre.userId.toString() === userId.toString() && membre.roles.includes("contributeur")
    );
  if (isContrib) return ["Rédacteur"];
  return [];
};

const getStructureRoles = (structures: Structure[], userId: UserId) => {
  if (!structures || structures.length === 0) return [];
  const structure = structures[0];
  if (!structure) return [];

  return getRole(structure.membres, userId);
};

export const getStructures = (userId: UserId, structures: Structure[]): UserStructure[] =>
  structures.map((structure) => {
    const role = getRole(structure.membres, userId);
    return {
      _id: structure._id,
      nom: structure.nom,
      picture: structure.picture,
      role
    };
  });

export const getAllUsers = async (): ResponseWithData<GetAllUsersResponse[]> => {
  logger.info("[getAllUsers] received")
  const neededFields = {
    username: 1,
    picture: 1,
    status: 1,
    created_at: 1,
    roles: 1,
    structures: 1,
    email: 1,
    phone: 1,
    selectedLanguages: 1,
    adminComments: 1
  };

  const users = await getAllUsersFromDB(neededFields, true);

  const result = users.map(user => {
    const plateformeRoles = user.getPlateformeRoles();
    const structureRoles = getStructureRoles(user.getStructures(), user._id);
    const roles = plateformeRoles.concat(structureRoles);

    //@ts-ignore FIXME ref type
    const res: GetAllUsersResponse = {
      ...pick(user, ["_id", "username", "picture", "status", "email", "adminComments", "created_at", "last_connected", "phone", "selectedLanguages"]),
      roles,
      structures: getStructures(user._id, user.getStructures()),
      nbStructures: user.structures ? user.structures.length : 0,
      nbContributions: user.contributions ? user.contributions.length : 0
    }
    return res
  });

  return {
    text: "success",
    data: result
  }
};
