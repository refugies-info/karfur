import { GetUserInfoResponse, UserStatus } from "api-types";
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
  traductionsFaites: []
};

export const testUserWithRoles: GetUserInfoResponse = {
  ...testUser,
  structures: ["testObjectId"],
  roles: [
    { nom: "Admin", _id: "testObjectId", nomPublic: "Admin" },
    { nom: "Trad", _id: "testObjectId", nomPublic: "Trad" },
    {
      nom: "ExpertTrad",
      _id: "testObjectId",
      nomPublic: "ExpertTrad"
    },
    {
      nom: "Contrib",
      _id: "testObjectId",
      nomPublic: "Contrib"
    }
  ]
};
