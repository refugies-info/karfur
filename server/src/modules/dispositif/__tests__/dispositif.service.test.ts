// @ts-nocheck
import { updateDispositifInDB } from "../dispositif.repository";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { publishDispositif } from "../dispositif.service";
import { sendMailWhenDispositifPublished } from "../../mail/sendMailWhenDispositifPublished";
import { sendNotificationsForDispositif } from "../../../modules/notifications/notifications.service";

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

jest.mock("../../../modules/notifications/notifications.service", () => ({
  sendNotificationsForDispositif: jest.fn(),
}));

describe("publish dispositif", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update languages avancement and add content in airtable", async () => {
    updateDispositifInDB.mockResolvedValueOnce({
      typeContenu: "demarche",
      theme: { _id: "theme1", short: {fr: "short title"} },
      secondaryThemes: []
    });
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    await publishDispositif("id");

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalled();
    expect(sendMailWhenDispositifPublished).toHaveBeenCalled();
  });

  const dispositif = {
    typeContenu: "dispositif",
    titreInformatif: "ti",
    titreMarque: "tm",
    _id: "id",
    theme: {_id: "theme1", short: {fr: "short title"}},
    secondaryThemes: [],
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
      ["short title"],
      "dispositif",
      null,
      [],
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
      ["short title"],
      "dispositif",
      null,
      [],
      false
    );
    expect(sendMailWhenDispositifPublished).toHaveBeenCalledWith(dispositif);
    expect(sendNotificationsForDispositif).toHaveBeenCalled();
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
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalled();
    expect(sendMailWhenDispositifPublished).toHaveBeenCalled();
    expect(sendNotificationsForDispositif).toHaveBeenCalled();
  });
});
