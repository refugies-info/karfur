import { StructureStatus } from "@refugies-info/api-types";
import { ObjectId, Structure } from "~/typegoose";

export const structureFixture: Structure = new Structure();

structureFixture._id = new ObjectId("6569c41c61b13ef31806fadb");
structureFixture.createur = new ObjectId("6569af9815c38bd134125ff3");
structureFixture.link = "www.associationmotamot.org";
structureFixture.nom = "Mot à Mot";
structureFixture.status = StructureStatus.ACTIVE;
structureFixture.picture = {
  secure_url: "https://res.cloudinary.com/dlmqnnhp6/image/upload/v1701430229/pictures/rxvgu9ivip3kksatgomc.jpg",
  public_id: "pictures/rxvgu9ivip3kksatgomc",
  imgId: "6569c3d661b13ef31806fab2",
};
structureFixture.structureTypes = [];
structureFixture.websites = [];
structureFixture.activities = [];
structureFixture.departments = [];
structureFixture.phonesPublic = [];
structureFixture.mailsPublic = [];
structureFixture.disposAssociesLocalisation = [];
structureFixture.membres = [
  {
    userId: "6569af9815c38bd134125ff3",
    added_at: new Date("2023-12-01T14:25:27.089Z"),
  },
];
// structure.created_at = new Date("2023-12-01T11:31:40.584Z");
// structure.updatedAt = new Date("2023-12-01T14:25:27.089Z");
