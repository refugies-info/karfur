import { GetUserInfoResponse, RoleName, UserStatus } from "@refugies-info/api-types";

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
  sso: false,
};

export const testUserWithRoles: GetUserInfoResponse = {
  ...testUser,
  structures: ["testObjectId"],
  roles: [
    { nom: RoleName.ADMIN, _id: "testObjectId", nomPublique: "Admin" },
    { nom: RoleName.TRAD, _id: "testObjectId", nomPublique: "Trad" },
    {
      nom: RoleName.EXPERT_TRAD,
      _id: "testObjectId",
      nomPublique: "ExpertTrad",
    },
    {
      nom: RoleName.CONTRIB,
      _id: "testObjectId",
      nomPublique: "Contrib",
    },
  ],
};
