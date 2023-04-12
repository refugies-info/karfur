import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { User } from "../../../typegoose";
import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { AuthenticationError } from "../../../errors";
import { GetActiveUsersResponse } from "@refugies-info/api-types";

export const getActiveUsers = async (user: User): ResponseWithData<GetActiveUsersResponse[]> => {
  logger.info("[getActiveUsers] received");
  const neededFields = {
    username: 1,
    picture: 1,
    status: 1,
    email: 1,
  };

  const users = await getAllUsersFromDB(neededFields);

  // Check authorizations
  const hasStructure = user && user.structures && user.structures?.length > 0;
  if (!hasStructure) throw new AuthenticationError("You are not authorized to get users");

  const result = users.map((user) => {
    const simpleUser: GetActiveUsersResponse = {
      _id: user._id,
      username: user.username,
      picture: user.picture,
      status: user.status,
      email: user.email,
    };
    return simpleUser;
  });

  return {
    text: "success",
    data: result,
  };
};
