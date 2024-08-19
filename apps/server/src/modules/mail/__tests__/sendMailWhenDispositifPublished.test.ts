// @ts-nocheck
import { sendMailWhenDispositifPublished } from "../sendMailWhenDispositifPublished";
import { getStructureMembers } from "../../structure/structure.service";
import { getUsersFromStructureMembres } from "../../users/users.service";
import {
  sendPublishedMailToStructureMembers,
  sendPublishedMailToCreator,
} from "../mailFunctions";

jest.mock("../../structure/structure.service", () => ({
  getStructureMembers: jest.fn(),
}));

jest.mock("../../users/users.service", () => ({
  getUsersFromStructureMembres: jest.fn(),
}));

jest.mock("../mailFunctions", () => ({
  sendPublishedMailToStructureMembers: jest.fn(),
  sendPublishedMailToCreator: jest.fn(),
}));

describe.skip("sendMailWhenDispositifPublished", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const dispositif = {
    mainSponsor: "sponsorId",
    titreInformatif: "TI",
    titreMarque: "TM",
    _id: "id",
    creatorId: "creatorId",
    typeContenu: "dispositif",
  };

  const lien = "https://refugies.info/dispositif/id";

  it("should get structure members get users and send mails when creator not in structure", async () => {
    const structureMembers = [{ userId: "id1" }, { userId: "id2" }];
    const membres = [{ _id: "id1" }, { _id: "id2" }];
    getStructureMembers.mockResolvedValueOnce(structureMembers);
    getUsersFromStructureMembres.mockResolvedValueOnce(membres);

    await sendMailWhenDispositifPublished(dispositif);
    expect(getStructureMembers).toHaveBeenCalledWith("sponsorId");
    expect(getUsersFromStructureMembres).toHaveBeenCalledWith(structureMembers);
    expect(sendPublishedMailToStructureMembers).toHaveBeenCalledWith(
      membres,
      "TI",
      "TM",
      lien,
      "id"
    );
    expect(sendPublishedMailToCreator).toHaveBeenCalledWith(
      dispositif,
      "TI",
      "TM",
      lien
    );
  });

  it("should get structure members get users and send mails when creator in structure", async () => {
    const structureMembers = [{ userId: "id1" }, { userId: "creatorId" }];
    const membres = [{ _id: "id1" }, { _id: "creatorId" }];
    getStructureMembers.mockResolvedValueOnce(structureMembers);
    getUsersFromStructureMembres.mockResolvedValueOnce(membres);

    await sendMailWhenDispositifPublished(dispositif);
    expect(getStructureMembers).toHaveBeenCalledWith("sponsorId");
    expect(getUsersFromStructureMembres).toHaveBeenCalledWith(structureMembers);
    expect(sendPublishedMailToStructureMembers).toHaveBeenCalledWith(
      membres,
      "TI",
      "TM",
      lien,
      "id"
    );
    expect(sendPublishedMailToCreator).not.toHaveBeenCalled();
  });
});
