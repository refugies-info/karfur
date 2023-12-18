import { StructureStatus } from "@refugies-info/api-types";
import { Structure, ObjectId } from "../typegoose";

const structure: Structure = new Structure();
structure._id = new ObjectId("6569c41c61b13ef31806fadb")
structure.createur = new ObjectId("6569af9815c38bd134125ff3")
structure.link = "www.associationmotamot.org"
structure.nom = "Mot à Mot"
structure.status = StructureStatus.ACTIVE;
structure.picture = {
  "secure_url": "https://res.cloudinary.com/dlmqnnhp6/image/upload/v1701430229/pictures/rxvgu9ivip3kksatgomc.jpg",
  "public_id": "pictures/rxvgu9ivip3kksatgomc",
  "imgId": "6569c3d661b13ef31806fab2"
}
structure.structureTypes = [];
structure.websites = [];
structure.activities = [];
structure.departments = [];
structure.phonesPublic = [];
structure.mailsPublic = [];
structure.disposAssociesLocalisation = [];
structure.membres = [
  {
    userId: "6569af9815c38bd134125ff3",
    roles: [
      "administrateur"
    ],
    added_at: new Date("2023-12-01T14:25:27.089Z")
  }
];
// structure.created_at = new Date("2023-12-01T11:31:40.584Z");
// structure.updatedAt = new Date("2023-12-01T14:25:27.089Z");

export { structure }
