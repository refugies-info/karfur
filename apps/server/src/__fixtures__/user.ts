import { UserStatus } from "@refugies-info/api-types";
import { ObjectId, User } from "~/typegoose";

const user = new User();
user._id = new ObjectId("6569af9815c38bd134125ff3");
user.username = "user";
user.email = "user@test.com";
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

export { user };
