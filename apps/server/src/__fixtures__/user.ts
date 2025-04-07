import { UserStatus } from "@refugies-info/api-types";
import { ObjectId, User } from "~/typegoose";

export const userFixture = new User();

userFixture._id = new ObjectId("6569af9815c38bd134125ff3");
userFixture.username = "user";
userFixture.email = "user@test.com";
userFixture.picture = {
  imgId: "",
  public_id: "",
  secure_url: "",
};
userFixture.roles = [];
userFixture.selectedLanguages = [];
userFixture.status = UserStatus.ACTIVE;
userFixture.favorites = [];
userFixture.created_at = new Date("01-01-2023");
