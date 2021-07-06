// @ts-nocheck
import { updateDispositifInDB } from "../dispositif.repository";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { publishDispositif } from "../dispositif.service";
import { sendMailWhenDispositifPublished } from "../../mail/sendMailWhenDispositifPublished";

jest.mock("../../../modules/langues/langues.service", () => ({
  updateLanguagesAvancement: jest.fn(),
}));

jest.mock("../../../controllers/miscellaneous/airtable", () => ({
  addOrUpdateDispositifInContenusAirtable: jest.fn(),
}));

jest.mock("../dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
}));

jest.mock("../../mail/sendMailWhenDispositifPublished", () => ({
  sendMailWhenDispositifPublished: jest.fn(),
}));

describe("publish dispositif", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update languages avancement and add content in airtble", async () => {
    updateDispositifInDB.mockResolvedValueOnce({ typeContenu: "demarche" });
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    await publishDispositif("id");

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(sendMailWhenDispositifPublished).not.toHaveBeenCalled();
  });

  const dispositif = {
    typeContenu: "dispositif",
    titreInformatif: "ti",
    titreMarque: "tm",
    _id: "id",
    tags: [],
    creatorId: "creatorId",
  };

  it("updateLanguagesAvancement throws", async () => {
    updateLanguagesAvancement.mockRejectedValueOnce(new Error("erreur"));
    updateDispositifInDB.mockResolvedValueOnce(dispositif);
    const date = 148707670800;
    Date.now = jest.fn(() => date);
    await publishDispositif("id");

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "ti",
      "tm",
      "id",
      [],
      null,
      false
    );
    expect(sendMailWhenDispositifPublished).toHaveBeenCalledWith(dispositif);
  });

  it("should return a 200 when new status is actif and a dispositif ", async () => {
    updateDispositifInDB.mockResolvedValueOnce(dispositif);
    const date = 148707670800;
    Date.now = jest.fn(() => date);
    await publishDispositif("id");

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "ti",
      "tm",
      "id",
      [],
      null,
      false
    );
    expect(sendMailWhenDispositifPublished).toHaveBeenCalledWith(dispositif);
  });

  it("should return a 200 when new status is actif and a demarche ", async () => {
    updateDispositifInDB.mockResolvedValueOnce({
      ...dispositif,
      typeContenu: "demarche",
    });
    const date = 148707670800;
    Date.now = jest.fn(() => date);
    await publishDispositif("id");

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(sendMailWhenDispositifPublished).not.toHaveBeenCalled();
  });
});
