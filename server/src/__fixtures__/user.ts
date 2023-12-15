import { User } from "../typegoose";
import { UserStatus } from "@refugies-info/api-types";

const user = new User();
user.username = "user";
user.email = "user@test.com";
user.picture = {
  imgId: "",
  public_id: "",
  secure_url: ""
};
user.roles = [];
user.selectedLanguages = [];
user.status = UserStatus.ACTIVE;
user.favorites = [];
user.created_at = new Date("01-01-2023");

export { user };
