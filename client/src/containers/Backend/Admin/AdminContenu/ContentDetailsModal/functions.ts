import { ObjectId } from "mongodb";
import { SimplifiedCreator, SimplifiedUser } from "types/interface";

export const findUser = (userId: ObjectId, users: SimplifiedUser[]): SimplifiedCreator | null => {
  const user = users.find(u => u._id === userId);
  return user ? {
    _id: user._id,
    username: user.username,
    picture: user.picture,
    email: user.email,
  } : null;
}
