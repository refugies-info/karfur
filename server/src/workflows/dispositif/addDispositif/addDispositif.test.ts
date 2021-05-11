// @ts-nocheck
import { addDispositif } from "./addDispositif";
import {
  getDispositifByIdWithMainSponsor,
  updateDispositifInDB,
  createDispositifInDB,
} from "../../../modules/dispositif/dispositif.repository";
import {
  checkUserIsAuthorizedToModifyDispositif,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { updateTraductions } from "../../../modules/traductions/updateTraductions";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import { updateAssociatedDispositifsInStructure } from "../../../modules/structure/structure.repository";
import { getRoleByName } from "../../../controllers/role/role.repository";
import { addRoleAndContribToUser } from "../../../modules/users/users.repository";
import { sendMailToStructureMembersWhenDispositifEnAttente } from "../../../modules/mail/sendMailToStructureMembersWhenDispositifEnAttente";

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDispositifByIdWithMainSponsor: jest.fn(),
  updateDispositifInDB: jest.fn(),
  createDispositifInDB: jest.fn(),
}));

jest.mock(
  "../../../modules/mail/sendMailToStructureMembersWhenDispositifEnAttente",
  () => ({
    sendMailToStructureMembersWhenDispositifEnAttente: jest.fn(),
  })
);

jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkUserIsAuthorizedToModifyDispositif: jest.fn(),
}));

jest.mock("../../../modules/traductions/updateTraductions", () => ({
  updateTraductions: jest.fn(),
}));

jest.mock("../../../controllers/miscellaneous/airtable", () => ({
  addOrUpdateDispositifInContenusAirtable: jest.fn(),
}));

jest.mock("../../../modules/langues/langues.service", () => ({
  updateLanguagesAvancement: jest.fn(),
}));

jest.mock("../../../modules/structure/structure.repository", () => ({
  updateAssociatedDispositifsInStructure: jest.fn(),
}));

jest.mock("../../../controllers/role/role.repository", () => ({
  getRoleByName: jest.fn(),
}));

jest.mock("../../../modules/users/users.repository", () => ({
  addRoleAndContribToUser: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("addDispositif", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = { fromSite: false };
    await addDispositif(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true };
    await addDispositif(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, body: { titreMarque: "id" } };
    await addDispositif(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200 if new dispositif without mainSponsor", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "idContrib" });
    createDispositifInDB.mockResolvedValueOnce({ _id: "dispoId" });
    const dispositif = {
      titreInformatif: "TI",
      status: "Brouillon",
    };
    const req = {
      fromSite: true,
      body: dispositif,
      userId: "userId",
    };
    await addDispositif(req, res);
    expect(createDispositifInDB).toHaveBeenCalledWith({
      titreInformatif: "TI",
      status: "Brouillon",
      creatorId: "userId",
    });
    expect(getRoleByName).toHaveBeenCalledWith("Contrib");
    expect(addRoleAndContribToUser).toHaveBeenCalledWith(
      "userId",
      "idContrib",
      "dispoId"
    );
    expect(getDispositifByIdWithMainSponsor).not.toHaveBeenCalled();

    expect(updateAssociatedDispositifsInStructure).not.toHaveBeenCalled();
    expect(
      sendMailToStructureMembersWhenDispositifEnAttente
    ).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 if new dispositif with mainSponsor", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "idContrib" });
    createDispositifInDB.mockResolvedValueOnce({
      _id: "dispoId",
      mainSponsor: "mainSponsorId",
    });
    const dispositif = {
      titreInformatif: "TI",
      status: "Brouillon",
    };
    const req = {
      fromSite: true,
      body: dispositif,
      userId: "userId",
    };
    await addDispositif(req, res);
    expect(createDispositifInDB).toHaveBeenCalledWith({
      titreInformatif: "TI",
      status: "Brouillon",
      creatorId: "userId",
    });
    expect(getRoleByName).toHaveBeenCalledWith("Contrib");
    expect(addRoleAndContribToUser).toHaveBeenCalledWith(
      "userId",
      "idContrib",
      "dispoId"
    );
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispoId",
      "mainSponsorId"
    );
    expect(
      sendMailToStructureMembersWhenDispositifEnAttente
    ).not.toHaveBeenCalled();
    expect(getDispositifByIdWithMainSponsor).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 if new dispositif with mainSponsor and send mail if dispositif en attente", async () => {
    getRoleByName.mockResolvedValueOnce({ _id: "idContrib" });
    createDispositifInDB.mockResolvedValueOnce({
      _id: "dispoId",
      mainSponsor: "mainSponsorId",
    });
    const dispositif = {
      titreInformatif: "TI",
      status: "En attente",
      mainSponsor: "sponsorId",
      titreMarque: "TM",
      typeContenu: "dispositif",
    };
    const req = {
      fromSite: true,
      body: dispositif,
      userId: "userId",
    };
    await addDispositif(req, res);
    expect(createDispositifInDB).toHaveBeenCalledWith({
      titreInformatif: "TI",
      status: "En attente",
      mainSponsor: "sponsorId",
      titreMarque: "TM",
      typeContenu: "dispositif",
      creatorId: "userId",
    });
    expect(getRoleByName).toHaveBeenCalledWith("Contrib");
    expect(addRoleAndContribToUser).toHaveBeenCalledWith(
      "userId",
      "idContrib",
      "dispoId"
    );
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispoId",
      "mainSponsorId"
    );
    expect(
      sendMailToStructureMembersWhenDispositifEnAttente
    ).toHaveBeenCalledWith("sponsorId", "dispoId", "TI", "TM", "dispositif");
    expect(getDispositifByIdWithMainSponsor).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 if existing dispositif ", async () => {
    const originalDis = { avancement: 1 };
    getDispositifByIdWithMainSponsor.mockResolvedValueOnce(originalDis);
    updateDispositifInDB.mockResolvedValueOnce({
      _id: "dispoId",
      mainSponsor: "mainSponsorId",
    });

    const dispositif = {
      titreInformatif: "TI",
      status: "Brouillon",
      dispositifId: "dispoId",
      contenu: "contenu",
      typeContenu: "Brouillon",
    };
    const req = {
      fromSite: true,
      body: dispositif,
      userId: "userId",
      user: { roles: [] },
    };
    await addDispositif(req, res);
    expect(getDispositifByIdWithMainSponsor).toHaveBeenCalledWith(
      "dispoId",
      "all"
    );
    expect(updateTraductions).toHaveBeenCalledWith(
      originalDis,
      dispositif,
      "userId"
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("dispoId", dispositif);
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(createDispositifInDB).not.toHaveBeenCalled();
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispoId",
      "mainSponsorId"
    );
    expect(
      sendMailToStructureMembersWhenDispositifEnAttente
    ).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 if existing dispositif from Brouillon to en attente", async () => {
    const originalDis = { avancement: 1, status: "Brouillon" };
    getDispositifByIdWithMainSponsor.mockResolvedValueOnce(originalDis);
    updateDispositifInDB.mockResolvedValueOnce({
      _id: "dispoId",
      mainSponsor: "mainSponsorId",
    });

    const dispositif = {
      titreInformatif: "TI",
      status: "En attente",
      dispositifId: "dispoId",
      contenu: "contenu",
      typeContenu: "dispositif",
      titreMarque: "TM",
      mainSponsor: "sponsorId",
    };
    const req = {
      fromSite: true,
      body: dispositif,
      userId: "userId",
      user: { roles: [] },
    };
    await addDispositif(req, res);
    expect(getDispositifByIdWithMainSponsor).toHaveBeenCalledWith(
      "dispoId",
      "all"
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("dispoId", dispositif);
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(createDispositifInDB).not.toHaveBeenCalled();
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispoId",
      "mainSponsorId"
    );
    expect(
      sendMailToStructureMembersWhenDispositifEnAttente
    ).toHaveBeenCalledWith("sponsorId", "dispoId", "TI", "TM", "dispositif");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 if existing dispositif from en attente to en attente (not send mail)", async () => {
    const originalDis = { avancement: 1, status: "En attente" };
    getDispositifByIdWithMainSponsor.mockResolvedValueOnce(originalDis);
    updateDispositifInDB.mockResolvedValueOnce({
      _id: "dispoId",
      mainSponsor: "mainSponsorId",
    });

    const dispositif = {
      titreInformatif: "TI",
      status: "En attente",
      dispositifId: "dispoId",
      contenu: "contenu",
      typeContenu: "dispositif",
      titreMarque: "TM",
      mainSponsor: "sponsorId",
    };
    const req = {
      fromSite: true,
      body: dispositif,
      userId: "userId",
      user: { roles: [] },
    };
    await addDispositif(req, res);

    expect(
      sendMailToStructureMembersWhenDispositifEnAttente
    ).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 500 if existing dispositif and not authorized", async () => {
    checkUserIsAuthorizedToModifyDispositif.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });

    const dispositif = {
      titreInformatif: "TI",
      status: "Brouillon",
      dispositifId: "dispoId",
    };
    const req = {
      fromSite: true,
      body: dispositif,
      userId: "userId",
    };
    await addDispositif(req, res);
    expect(getDispositifByIdWithMainSponsor).toHaveBeenCalledWith(
      "dispoId",
      "all"
    );
    expect(
      sendMailToStructureMembersWhenDispositifEnAttente
    ).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
