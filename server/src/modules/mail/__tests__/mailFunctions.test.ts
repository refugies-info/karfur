// @ts-nocheck
import {
  sendPublishedMailToCreator,
  sendPublishedMailToStructureMembers,
} from "../mailFunctions";
import { getUserById } from "../../users/users.repository";
import {
  sendPublishedFicheMailToCreatorService,
  sendPublishedFicheMailToStructureMembersService,
} from "../mail.service";

jest.mock("../../users/users.repository", () => ({
  getUserById: jest.fn(),
}));

jest.mock("../mail.service", () => ({
  sendPublishedFicheMailToCreatorService: jest.fn(),
  sendPublishedFicheMailToStructureMembersService: jest.fn(),
}));

const userNeededFields = {
  username: 1,
  email: 1,
  status: 1,
};
const dispositif = {
  titreInformatif: "TI",
  titreMarque: "TM",
  creatorId: "creatorId",
  typeContenu: "dispositif",
  _id: "dispoId",
  mainSponsor: "sponsorId",
};
describe.skip("sendPublishedMailToCreator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call getUserById and not other if user Exclu", async () => {
    getUserById.mockResolvedValueOnce({ status: "Exclu" });
    await sendPublishedMailToCreator(dispositif, "TI", "TM", "lien");
    expect(getUserById).toHaveBeenCalledWith("creatorId", userNeededFields);
    expect(sendPublishedFicheMailToCreatorService).not.toHaveBeenCalled();
  });

  it("should call getUserById and not other if user has no email", async () => {
    getUserById.mockResolvedValueOnce({ status: "Actif", _id: "id" });
    await sendPublishedMailToCreator(dispositif, "TI", "TM", "lien");
    expect(getUserById).toHaveBeenCalledWith("creatorId", userNeededFields);
    expect(sendPublishedFicheMailToCreatorService).not.toHaveBeenCalled();
  });

  it("should call getUserById and sendPublishedFicheMailToCreatorService", async () => {
    getUserById.mockResolvedValueOnce({
      status: "Actif",
      _id: "id",
      email: "email",
      username: "pseudo",
    });
    await sendPublishedMailToCreator(dispositif, "TI", "TM", "lien");
    expect(getUserById).toHaveBeenCalledWith("creatorId", userNeededFields);
    expect(sendPublishedFicheMailToCreatorService).toHaveBeenCalledWith({
      pseudo: "pseudo",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email",
      dispositifId: "dispoId",
      userId: "id",
    });
  });
});

describe.skip("sendPublishedMailToStructureMembers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const membre1 = { _id: "id1", username: "user1", email: "email1" };
  const membre2 = { _id: "id2", username: "user2", email: "email2" };
  const membre3 = { _id: "id3", username: "user3", email: "email3" };

  it("should call sendPublishedFicheMailToStructureMembersService with every membre", async () => {
    await sendPublishedMailToStructureMembers(
      [membre1, membre2, membre3],
      "TI",
      "TM",
      "lien",
      "dispoID"
    );

    expect(
      sendPublishedFicheMailToStructureMembersService
    ).toHaveBeenCalledWith({
      pseudo: "user1",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email1",
      dispositifId: "dispoID",
      userId: "id1",
    });

    expect(
      sendPublishedFicheMailToStructureMembersService
    ).toHaveBeenCalledWith({
      pseudo: "user2",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email2",
      dispositifId: "dispoID",
      userId: "id2",
    });

    expect(
      sendPublishedFicheMailToStructureMembersService
    ).toHaveBeenCalledWith({
      pseudo: "user3",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "lien",
      email: "email3",
      dispositifId: "dispoID",
      userId: "id3",
    });
  });
});
