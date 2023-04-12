import { User } from "../../../typegoose/User";
import { ResponseWithData } from "../../../types/interface";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { GetUserStatisticsResponse } from "@refugies-info/api-types";

export const getFiguresOnUsers = async (): ResponseWithData<GetUserStatisticsResponse> => {
  const users = await getAllUsersFromDB({ roles: 1 }, "roles");
  const nbContributors = users.filter((user: User) => user.hasRole("Contrib")).length;
  const nbTraductors = users.filter((user: User) => user.hasRole("Trad") || user.hasRole("ExpertTrad")).length;
  const nbExperts = users.filter((user: User) => user.hasRole("ExpertTrad")).length;

  return {
    text: "success",
    data: {
      nbContributors,
      nbTraductors,
      nbExperts,
    },
  };
};
