import { getAllUsersFromDB } from "../users.repository";
import { Res } from "../../../types/interface";

export const getAllUsers = async (_: any, res: Res) => {
  try {
    const users = await getAllUsersFromDB();

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).json({ text: "Erreur interne" });
  }
};
