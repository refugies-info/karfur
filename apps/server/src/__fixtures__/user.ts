import { UserStatus } from "@refugies-info/api-types";
import { ObjectId, UserModel } from "@refugies-info/mongo";

export const user = new UserModel();

user._id = new ObjectId("6569af9815c38bd134125ff3");
user.username = "user";
user.email = "user@test.com";
user.password = "password";
user.picture = {
  imgId: "",
  public_id: "",
  secure_url: "",
};
user.roles = [];
user.selectedLanguages = [];
user.status = UserStatus.ACTIVE;
user.favorites = [];
user.created_at = new Date("01-01-2023");
