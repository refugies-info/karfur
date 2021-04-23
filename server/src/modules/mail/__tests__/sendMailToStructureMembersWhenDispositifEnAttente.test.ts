import { sendMailToStructureMembersWhenDispositifEnAttente } from "../sendMailToStructureMembersWhenDispositifEnAttente";
import { getStructureMembers } from "../../structure/structure.service";
import { getUsersFromStructureMembres } from "../../users/users.service";
import { sendNewFicheEnAttenteMail } from "../mail.service";

jest.mock("../../structure/structure.service", () => ({
  getStructureMembers: jest.fn(),
}));

jest.mock("../../users/users.service", () => ({
  getUsersFromStructureMembres: jest.fn(),
}));

jest.mock("../mail.service", () => ({
  sendNewFicheEnAttenteMail: jest.fn(),
}));

describe("sendMailToStructureMembersWhenDispositifEnAttente", () => {
  it("should get structure members and send mail", async () => {
    const structureMembers = "structureMembers";
    const membre1 = { _id: "userId1", email: "email1", username: "pseudo1" };
    const membre2 = { _id: "userId2", email: "email2", username: "pseudo2" };
    const lien = "https://refugies.info/dispositif/dispoId";
    const data1 = {
      pseudo: "pseudo1",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien,
      email: "email1",
      dispositifId: "dispoId",
      userId: "userId1",
    };

    const data2 = {
      pseudo: "pseudo2",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien,
      email: "email2",
      dispositifId: "dispoId",
      userId: "userId2",
    };

    getStructureMembers.mockResolvedValueOnce(structureMembers);
    getUsersFromStructureMembres.mockResolvedValueOnce([membre1, membre2]);

    await sendMailToStructureMembersWhenDispositifEnAttente(
      "sponsorId",
      "dispoId",
      "TI",
      "TM",
      "dispositif"
    );
    expect(getStructureMembers).toHaveBeenCalledWith("sponsorId");
    expect(getUsersFromStructureMembres).toHaveBeenCalledWith(
      "structureMembers"
    );
    expect(sendNewFicheEnAttenteMail).toHaveBeenCalledWith(data1);
    expect(sendNewFicheEnAttenteMail).toHaveBeenCalledWith(data2);
  });
});
