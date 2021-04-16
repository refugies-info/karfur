// @ts-nocheck
import { sendPublishedTradMailToStructure } from "../sendPublishedTradMailToStructure";
import { getStructureMembers } from "../../structure/structure.service";
import { getUsersFromStructureMembres } from "../../users/users.service";
import { sendPublishedTradMailToStructureService } from "../mail.service";

jest.mock("../../structure/structure.service", () => ({
  getStructureMembers: jest.fn(),
}));

jest.mock("../../users/users.service", () => ({
  getUsersFromStructureMembres: jest.fn(),
}));

jest.mock("../mail.service", () => ({
  sendPublishedTradMailToStructureService: jest.fn(),
}));

describe("sendPublishedTradMailToStructure", () => {
  const structureMembers = "structureMembers";
  const membre1 = { _id: "membre1", username: "U1", email: "email1" };
  const membre2 = { _id: "membre2", username: "U2", email: "email2" };

  const membres = [membre1, membre2];

  const data1 = {
    pseudo: "U1",
    titreInformatif: "TI",
    titreMarque: "TM",
    lien: "https://refugies.info/dispositif/id",
    email: "email1",
    dispositifId: "id",
    userId: "membre1",
    langue: "anglais",
  };

  const data2 = {
    pseudo: "U2",
    titreInformatif: "TI",
    titreMarque: "TM",
    lien: "https://refugies.info/dispositif/id",
    email: "email2",
    dispositifId: "id",
    userId: "membre2",
    langue: "anglais",
  };

  it("should getStructureMembers get users and send published mail", async () => {
    getStructureMembers.mockResolvedValueOnce(structureMembers);
    getUsersFromStructureMembres.mockResolvedValueOnce(membres);
    const dispositif = {
      mainSponsor: "sponsorId",
      titreInformatif: "TI",
      titreMarque: "TM",
      typeContenu: "dispositif",
      _id: "id",
    };
    await sendPublishedTradMailToStructure(dispositif, "en");
    expect(getStructureMembers).toHaveBeenCalledWith("sponsorId");
    expect(getUsersFromStructureMembres).toHaveBeenCalledWith(structureMembers);
    expect(sendPublishedTradMailToStructureService).toHaveBeenCalledWith(data1);
    expect(sendPublishedTradMailToStructureService).toHaveBeenCalledWith(data2);
  });
});
