import { GetAllUsersResponse, UserStructure } from "@refugies-info/api-types";
import pick from "lodash/pick";
import logger from "~/logger";
import { getAllUsersForAdminFromDB } from "~/modules/users/users.repository";
import { Structure, UserId } from "~/typegoose";
import { ResponseWithData } from "~/types/interface";

export const getStructures = (userId: UserId, structures: Structure[]): UserStructure[] =>
  structures.map((structure) => {
    return {
      _id: structure._id,
      nom: structure.nom,
      picture: structure.picture,
      role: ["Responsable"],
    };
  });

export const getAllUsers = async (): ResponseWithData<GetAllUsersResponse[]> => {
  logger.info("[getAllUsers] received");
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
    adminComments: 1,
  };

  const users = await getAllUsersForAdminFromDB(neededFields);

  const result = users.map((user) => {
    const roles = user.getPlateformeRoles() as string[];

    const res: GetAllUsersResponse = {
      ...pick(user, [
        "_id",
        "username",
        "picture",
        "status",
        "email",
        "adminComments",
        "created_at",
        "last_connected",
        "phone",
        "selectedLanguages",
      ]),
      roles,
      structures: getStructures(user._id, user.getStructures()),
      nbStructures: user.structures ? user.structures.length : 0,
      nbContributions: user.contributions ? user.contributions.length : 0,
    };
    return res;
  });

  return {
    text: "success",
    data: result,
  };
};
