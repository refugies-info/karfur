import { type GetUserStatisticsResponse, RoleName } from "@refugies-info/api-types";
import type { User } from "@refugies-info/mongo";
import { getAllUsersFromDB } from "~/modules/users/users.repository";
import type { ResponseWithData } from "~/types/interface";

export const getFiguresOnUsers = async (): ResponseWithData<GetUserStatisticsResponse> => {
  const users = await getAllUsersFromDB({ roles: 1 }, "roles");
  const nbContributors = users.filter((user: User) => user.hasRole(RoleName.CONTRIB)).length;
  const nbTraductors = users.filter(
    (user: User) => user.hasRole(RoleName.TRAD) || user.hasRole(RoleName.EXPERT_TRAD),
  ).length;
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
