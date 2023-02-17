import { GetAllUsersResponse, Id } from "api-types";

export const findUser = (userId: Id, users: GetAllUsersResponse[]) => {
  const user = users.find(u => u._id === userId);
  return user ? {
    _id: user._id,
    username: user.username,
    picture: user.picture,
    email: user.email,
  } : null;
}
