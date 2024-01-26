import { GetUserInfoResponse, UserStatus } from "@refugies-info/api-types";
import { RoleName } from "@refugies-info/api-types/generics";
import moment from "moment";

const date = moment("2019-05-01 12:00:00");
export const testUser: GetUserInfoResponse = {
  username: "test",
  _id: "testObjectId",
  structures: [],
  contributions: [],
  phone: "",
  roles: [],
  email: "",
  selectedLanguages: [],
  status: UserStatus.ACTIVE,
};

export const testUserWithRoles: GetUserInfoResponse = {
  ...testUser,
  structures: ["testObjectId"],
  roles: [
    { nom: RoleName.ADMIN, _id: "testObjectId", nomPublic: "Admin" },
    { nom: RoleName.TRAD, _id: "testObjectId", nomPublic: "Trad" },
    {
      nom: RoleName.EXPERT_TRAD,
      _id: "testObjectId",
      nomPublic: "ExpertTrad"
    },
    {
      nom: RoleName.CONTRIB,
      _id: "testObjectId",
      nomPublic: "Contrib"
    }
  ]
};
