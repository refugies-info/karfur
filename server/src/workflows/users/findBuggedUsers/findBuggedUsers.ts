/* NOT USED : only to find user without role hasStructure but with a structure
import logger from "../../../logger";
import { User } from "../../../schema/schemaUser";
import { Res } from "../../../types/interface";

export const findBuggedUsers = async (_: any, res: Res) => {
  try {
    logger.info("findBuggedUsers");
    const users = await User.find({}).sort({ created_at: -1 });

    const usersWithStructuresWithCorrectRole = users.filter((user) => {
      if (!user.structures || user.structures.length === 0) return false;

      const filterRoles = user.roles.filter((role) => {
        if (!role) return false;

        return role.toString() === "5d52df149193c9bb5402e9bc";
      });
      if (filterRoles.length > 0) return false;
      return true;
    });

    const data = usersWithStructuresWithCorrectRole.map((user) => ({
      _id: user._id,
      pseudo: user.username,
      structures: user.structures,
      roles: user.roles,
      created_at: user.created_at,
    }));

    res.status(200).json({
      nbBug: usersWithStructuresWithCorrectRole.length,
      data,
    });
  } catch (error) {
    logger.error("error", { error: error.message });
    res.status(500).json({ data: "KO" });
  }
};
*/
