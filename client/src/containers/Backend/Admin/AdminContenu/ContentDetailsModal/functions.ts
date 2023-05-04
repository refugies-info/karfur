import { GetAllUsersResponse, Id, SimpleUser } from "api-types";

export const findUser = (userId: Id, users: GetAllUsersResponse[]): SimpleUser | null => {
  const user = users.find(u => u._id === userId);
  return user ? {
    _id: user._id,
    username: user.username,
    picture: user.picture || undefined,
    email: user.email || "",
  } : null;
}
