import * as languesService from "~/modules/langues/langues.service";
import { sendNotificationsForDispositif } from "~/modules/notifications/notifications.service";
import { demarche, dispositif } from "../../../__fixtures__";
import { sendMailWhenDispositifPublished } from "../../mail/sendMailWhenDispositifPublished";
import * as repository from "../dispositif.repository";
import { publishDispositif } from "../dispositif.service";

jest.mock("airtable");
jest.mock("@sendgrid/mail");

describe.skip("publish dispositif", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update languages avancement and add content in airtable", async () => {
    const updateDispositifInDBMock = jest.spyOn(repository, "updateDispositifInDB");
    const updateLanguagesAvancementMock = jest.spyOn(languesService, "updateLanguagesAvancement");

    updateDispositifInDBMock.mockResolvedValueOnce(demarche);

    const date = 148707670800;
    Date.now = jest.fn(() => date);

    await publishDispositif("id", "userId");

    expect(updateDispositifInDBMock).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancementMock).toHaveBeenCalled();
    expect(sendMailWhenDispositifPublished).toHaveBeenCalled();
  });

  it("updateLanguagesAvancement throws", async () => {
    const updateDispositifInDBMock = jest.spyOn(repository, "updateDispositifInDB");
    const updateLanguagesAvancementMock = jest.spyOn(languesService, "updateLanguagesAvancement");

    updateDispositifInDBMock.mockResolvedValueOnce(dispositif);
    updateLanguagesAvancementMock.mockRejectedValueOnce(new Error("erreur"));

    updateDispositifInDBMock.mockResolvedValueOnce(dispositif);
    const date = 148707670800;
    Date.now = jest.fn(() => date);
    await publishDispositif("id", "userId");

    expect(updateDispositifInDBMock).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancementMock).toHaveBeenCalledWith();
    expect(sendMailWhenDispositifPublished).toHaveBeenCalledWith(dispositif);
  });

  it("should return a 200 when new status is actif and a dispositif ", async () => {
    const updateDispositifInDBMock = jest.spyOn(repository, "updateDispositifInDB");
    const updateLanguagesAvancementMock = jest.spyOn(languesService, "updateLanguagesAvancement");

    updateDispositifInDBMock.mockResolvedValueOnce(dispositif);

    const date = 148707670800;
    Date.now = jest.fn(() => date);
    await publishDispositif("id", "userId");

    expect(updateDispositifInDBMock).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancementMock).toHaveBeenCalledWith();
    expect(sendMailWhenDispositifPublished).toHaveBeenCalledWith(dispositif);
    expect(sendNotificationsForDispositif).toHaveBeenCalled();
  });

  it("should return a 200 when new status is actif and a demarche ", async () => {
    const updateDispositifInDBMock = jest.spyOn(repository, "updateDispositifInDB");
    const updateLanguagesAvancementMock = jest.spyOn(languesService, "updateLanguagesAvancement");

    updateDispositifInDBMock.mockResolvedValueOnce(dispositif);

    const date = 148707670800;
    Date.now = jest.fn(() => date);
    await publishDispositif("id", "userId");

    expect(updateDispositifInDBMock).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancementMock).toHaveBeenCalledWith();
    expect(sendMailWhenDispositifPublished).toHaveBeenCalled();
    expect(sendNotificationsForDispositif).toHaveBeenCalled();
  });
});
