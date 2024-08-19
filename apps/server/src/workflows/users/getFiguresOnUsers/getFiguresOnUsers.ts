import { User } from "../../../typegoose/User";
import { ResponseWithData } from "../../../types/interface";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { GetUserStatisticsResponse, RoleName } from "@refugies-info/api-types";

export const getFiguresOnUsers = async (): ResponseWithData<GetUserStatisticsResponse> => {
  const users = await getAllUsersFromDB({ roles: 1 }, "roles");
  const nbContributors = users.filter((user: User) => user.hasRole(RoleName.CONTRIB)).length;
  const nbTraductors = users.filter((user: User) => user.hasRole(RoleName.TRAD) || user.hasRole(RoleName.EXPERT_TRAD)).length;
  const nbExperts = users.filter((user: User) => user.hasRole(RoleName.EXPERT_TRAD)).length;

  return {
    text: "success",
    data: {
      nbContributors,
      nbTraductors,
      nbExperts,
    },
  };
};
