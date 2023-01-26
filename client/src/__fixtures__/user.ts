import { ObjectId } from "mongodb";
import moment from "moment";

const date = moment("2019-05-01 12:00:00");
export const testUser = {
  username: "test",
  updatedAt: date,
  created_at: date,
  _id: new ObjectId("testObjectId"),
  structures: []
};

export const testUserWithRoles = {
  ...testUser,
  structures: [new ObjectId("testObjectId")],
  roles: [
    { nom: "Admin", _id: new ObjectId("testObjectId"), nomPublique: "Admin" },
    { nom: "Trad", _id: new ObjectId("testObjectId"), nomPublique: "Trad" },
    {
      nom: "ExpertTrad",
      _id: new ObjectId("testObjectId"),
      nomPublique: "ExpertTrad"
    },
    {
      nom: "Contrib",
      _id: new ObjectId("testObjectId"),
      nomPublique: "Contrib"
    }
  ]
};
