// @ts-nocheck
import {
  sendPublishedMailToCreator,
  sendPublishedMailToStructureMembers,
} from "../dispositif.mail.service";
import { getUserById } from "../../users/users.repository";
import { sendPublishedFicheMail } from "../../mail/mail.service";
import { getStructureFromDB } from "../../structure/structure.repository";

jest.mock("../../users/users.repository", () => ({
  getUserById: jest.fn(),
}));

jest.mock("../../mail/mail.service", () => ({
  sendPublishedFicheMail: jest.fn(),
}));
jest.mock("../../structure/structure.repository", () => ({
  getStructureFromDB: jest.fn(),
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
describe("sendPublishedMailToCreator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call getUserById and not other if user Exclu", async () => {
    getUserById.mockResolvedValueOnce({ status: "Exclu" });
    await sendPublishedMailToCreator(dispositif);
    expect(getUserById).toHaveBeenCalledWith("creatorId", userNeededFields);
    expect(sendPublishedFicheMail).not.toHaveBeenCalled();
  });

  it("should call getUserById and not other if user has no email", async () => {
    getUserById.mockResolvedValueOnce({ status: "Actif", _id: "id" });
    await sendPublishedMailToCreator(dispositif);
    expect(getUserById).toHaveBeenCalledWith("creatorId", userNeededFields);
    expect(sendPublishedFicheMail).not.toHaveBeenCalled();
  });

  it("should call getUserById and sendPublishedFicheMail", async () => {
    getUserById.mockResolvedValueOnce({
      status: "Actif",
      _id: "id",
      email: "email",
      username: "pseudo",
    });
    await sendPublishedMailToCreator(dispositif);
    expect(getUserById).toHaveBeenCalledWith("creatorId", userNeededFields);
    expect(sendPublishedFicheMail).toHaveBeenCalledWith({
      pseudo: "pseudo",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "https://refugies.info/dispositif/dispoId",
      email: "email",
      dispositifId: "dispoId",
      userId: "id",
    });
  });
});

describe("sendPublishedMailToStructureMembers", () => {
  const structureNeededFields = { membres: 1 };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should getStructureFromDB and nothing else if no member", async () => {
    getStructureFromDB.mockResolvedValueOnce({ _id: "sponsorId" });
    await sendPublishedMailToStructureMembers(dispositif);
    expect(getStructureFromDB).toHaveBeenCalledWith(
      "sponsorId",
      false,
      structureNeededFields
    );
    expect(getUserById).not.toHaveBeenCalled();
    expect(sendPublishedFicheMail).not.toHaveBeenCalled();
  });

  it("should getStructureFromDB and nothing else if no member", async () => {
    getStructureFromDB.mockResolvedValueOnce({ _id: "sponsorId", membres: [] });
    await sendPublishedMailToStructureMembers(dispositif);
    expect(getStructureFromDB).toHaveBeenCalledWith(
      "sponsorId",
      false,
      structureNeededFields
    );
    expect(getUserById).not.toHaveBeenCalled();
    expect(sendPublishedFicheMail).not.toHaveBeenCalled();
  });

  it("should getStructureFromDB and nothing else if no structure", async () => {
    getStructureFromDB.mockResolvedValueOnce(null);
    await sendPublishedMailToStructureMembers(dispositif);
    expect(getStructureFromDB).toHaveBeenCalledWith(
      "sponsorId",
      false,
      structureNeededFields
    );
    expect(getUserById).not.toHaveBeenCalled();
    expect(sendPublishedFicheMail).not.toHaveBeenCalled();
  });

  const membre1 = { test: "test" };
  const membre2 = { userId: "creatorId" };
  const membre3 = { userId: "userId3" };
  const membre4 = { userId: "userId4" };

  it("should getStructureFromDB and getUserById and not send mail", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      _id: "sponsorId",
      membres: [membre1, membre2, membre3, membre4],
    });
    getUserById.mockResolvedValueOnce({ status: "Exclu" });
    getUserById.mockResolvedValueOnce({ status: "Actif" });

    await sendPublishedMailToStructureMembers(dispositif);
    expect(getStructureFromDB).toHaveBeenCalledWith(
      "sponsorId",
      false,
      structureNeededFields
    );
    expect(getUserById).not.toHaveBeenCalledWith("creatorId", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("userId3", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("userId4", userNeededFields);

    expect(sendPublishedFicheMail).not.toHaveBeenCalled();
  });

  const membre5 = { userId: "userId5" };
  const membre6 = { userId: "userId6" };

  it("should getStructureFromDB and getUserById and send mail", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      _id: "sponsorId",
      membres: [membre5, membre6],
    });
    getUserById.mockResolvedValueOnce({
      status: "Actif",
      email: "email5",
      username: "membre5",
      _id: "userId5",
    });
    getUserById.mockResolvedValueOnce({
      status: "Actif",
      email: "email6",
      username: "membre6",
      _id: "userId6",
    });

    await sendPublishedMailToStructureMembers(dispositif);
    expect(getStructureFromDB).toHaveBeenCalledWith(
      "sponsorId",
      false,
      structureNeededFields
    );
    expect(getUserById).toHaveBeenCalledWith("userId5", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("userId6", userNeededFields);
    expect(sendPublishedFicheMail).toHaveBeenCalledWith({
      pseudo: "membre5",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "https://refugies.info/dispositif/dispoId",
      email: "email5",
      dispositifId: "dispoId",
      userId: "userId5",
    });

    expect(sendPublishedFicheMail).toHaveBeenCalledWith({
      pseudo: "membre6",
      titreInformatif: "TI",
      titreMarque: "TM",
      lien: "https://refugies.info/dispositif/dispoId",
      email: "email6",
      dispositifId: "dispoId",
      userId: "userId6",
    });
  });
});
