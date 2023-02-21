import moment from "moment";

const date = moment("2019-05-01 12:00:00");
export const testUser = {
  username: "test",
  updatedAt: date,
  created_at: date,
  _id: "testObjectId",
  structures: []
};

export const testUserWithRoles = {
  ...testUser,
  structures: ["testObjectId"],
  roles: [
    { nom: "Admin", _id: "testObjectId", nomPublique: "Admin" },
    { nom: "Trad", _id: "testObjectId", nomPublique: "Trad" },
    {
      nom: "ExpertTrad",
      _id: "testObjectId",
      nomPublique: "ExpertTrad"
    },
    {
      nom: "Contrib",
      _id: "testObjectId",
      nomPublique: "Contrib"
    }
  ]
};
