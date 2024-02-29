import { User } from "../../../typegoose";
import { deleteUser } from "../../../modules/users/users.service";

export const deleteMyAccount = async (user: User) => deleteUser(user)
