import logger from "src/logger";
import { UserModel } from "src/typegoose";
import { User, UserStatus } from "src/typegoose/User";
import { Res } from "src/types/interface";

export const getFiguresOnUsers = async (req: Request, res: Res) => {
  try {
    // TO DO IN REPO
    const users = await UserModel.find({ status: UserStatus.USER_STATUS_ACTIVE }, { roles: 1 }).populate("roles");
    const nbContributors = users.filter((user: User) => user.hasRole("Contrib")).length;
    const nbTraductors = users.filter((user: User) => user.hasRole("Trad") || user.hasRole("ExpertTrad")).length;
    const nbExperts = users.filter((user: User) => user.hasRole("ExpertTrad")).length;

    res.status(200).json({
      data: {
        nbContributors,
        nbTraductors,
        nbExperts,
      },
    });
  } catch (error) {
    logger.error("[getFiguresOnUsers] error while getting users", {
      error: error.message,
    });
    res.status(200).json({
      data: {
        nbContributors: 0,
        nbTraductors: 0,
        nbExperts: 0,
      },
    });
  }
};
