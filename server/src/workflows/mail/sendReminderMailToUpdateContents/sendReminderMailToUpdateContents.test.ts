// @ts-nocheck
import { sendReminderMailToUpdateContents } from "./sendReminderMailToUpdateContents";
import {
  getPublishedDispositifWithMainSponsor,
  updateDispositifInDB,
} from "../../../modules/dispositif/dispositif.repository";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";
import { sendUpdateReminderMailService } from "../../../modules/mail/mail.service";
import { getUserById } from "../../../modules/users/users.repository";
import moment from "moment";
import mockdate from "mockdate";
import logger from "../../../logger";

mockdate.set("2019-11-10T10:00:00.00Z");

jest.mock("../../../logger");
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkCronAuthorization: jest.fn(),
}));

jest.mock("../../../modules/users/users.repository", () => ({
  getUserById: jest.fn(),
}));

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getPublishedDispositifWithMainSponsor: jest.fn(),
  updateDispositifInDB: jest.fn(),
}));

jest.mock("../../../modules/mail/mail.service", () => ({
  sendUpdateReminderMailService: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("sendReminderMailToUpdateContents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 404 if not authorized", async () => {
    checkCronAuthorization.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendReminderMailToUpdateContents(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(res.status).toHaveBeenCalledWith(404);
  });

  const dispo1 = {
    _id: "id1",
    titreInformatif: "titre",
    typeContenu: "dispositif",
    updatedAt: moment.utc("2019-02-01T13:00:00.232Z"),
    mainSponsor: {
      _id: "sponsor_id",
      membres: [
        { roles: "administrateur", userId: "userId" },
        { roles: "contributeur", userId: "userId" },
      ],
    },
  };

  const dispo2 = {
    _id: "id2",
    titreInformatif: "titre",
    typeContenu: "dispositif",
    updatedAt: moment.utc("2019-02-01T13:00:00.232Z"),
    lastReminderMailSentToUpdateContentDate: moment.utc(
      "2019-10-01T13:00:00.232Z"
    ),
    mainSponsor: {
      _id: "sponsor_id",
      membres: [
        { roles: "administrateur", userId: "userId1" },
        { roles: "contributeur", userId: "userId2" },
      ],
    },
  };

  const dispo3 = {
    _id: "id3",
    titreInformatif: "titre",
    typeContenu: "demarche",
    lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
    mainSponsor: {
      _id: "sponsor_id",
      membres: [
        { roles: "administrateur", userId: "userId1" },
        { roles: "contributeur", userId: "userId2" },
      ],
    },
  };

  const dispo4 = {
    _id: "id4",
    titreInformatif: "titre",
    typeContenu: "dispositif",
    lastModificationDate: moment.utc("2019-11-07T13:00:00.232Z"),
    mainSponsor: {
      _id: "sponsor_id",
      membres: [
        { roles: "administrateur", userId: "userId1" },
        { roles: "contributeur", userId: "userId2" },
      ],
    },
  };

  it("should get dispositifs sendOneDraftReminderMailService for dispo id1, not id2 (received), not id3(nb days too small)", async () => {
    getPublishedDispositifWithMainSponsor.mockResolvedValueOnce([
      {
        ...dispo1,
        toJSON: () => dispo1,
      },
      {
        ...dispo2,
        toJSON: () => dispo2,
      },
      {
        ...dispo3,
        toJSON: () => dispo3,
      },
      {
        ...dispo4,
        toJSON: () => dispo4,
      },
    ]);
    getUserById.mockResolvedValue({
      username: "username",
      email: "email",
      _id: "userId",
    });
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendReminderMailToUpdateContents(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getPublishedDispositifWithMainSponsor).toHaveBeenCalledWith();
    expect(getUserById).toHaveBeenCalledWith("userId", {
      username: 1,
      email: 1,
    });
    expect(getUserById).toHaveBeenCalledWith("userId1", {
      username: 1,
      email: 1,
    });
    expect(getUserById).not.toHaveBeenCalledWith("userId2", {
      username: 1,
      email: 1,
    });

    expect(sendUpdateReminderMailService).toHaveBeenCalledWith(
      "email",
      "username",
      "titre",
      "userId",
      "id1",
      "https://refugies.info/dispositif/id1"
    );

    expect(sendUpdateReminderMailService).toHaveBeenCalledWith(
      "email",
      "username",
      "titre",
      "userId",
      "id3",
      "https://refugies.info/demarche/id3"
    );

    expect(sendUpdateReminderMailService).not.toHaveBeenCalledWith(
      "email",
      "username",
      "titre",
      "userId",
      "id4",
      "https://refugies.info/dispositif/id4"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendReminderMailToUpdateContents] received"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendReminderMailToUpdateContents] 4 dispositifs find"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendReminderMailToUpdateContents] dispositif with id id2 has already received reminder 40 days ago"
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      lastReminderMailSentToUpdateContentDate: 1573380000000,
    });
    expect(updateDispositifInDB).toHaveBeenCalledWith("id3", {
      lastReminderMailSentToUpdateContentDate: 1573380000000,
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get dispositifs sendOneDraftReminderMailService for dispo with object in titre info", async () => {
    const dispo1 = {
      _id: "id1",
      titreInformatif: { fr: "titre" },
      typeContenu: "dispositif",
      updatedAt: moment.utc("2019-02-01T13:00:00.232Z"),
      mainSponsor: {
        _id: "sponsor_id",
        membres: [
          { roles: "administrateur", userId: "userId" },
          { roles: "contributeur", userId: "userId" },
        ],
      },
    };

    getPublishedDispositifWithMainSponsor.mockResolvedValueOnce([
      { ...dispo1, toJSON: () => dispo1 },
    ]);
    getUserById.mockResolvedValue({
      username: "username",
      email: "email",
      _id: "userId",
    });
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendReminderMailToUpdateContents(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getPublishedDispositifWithMainSponsor).toHaveBeenCalledWith();
    expect(getUserById).toHaveBeenCalledWith("userId", {
      username: 1,
      email: 1,
    });
    expect(sendUpdateReminderMailService).toHaveBeenCalledWith(
      "email",
      "username",
      "titre",
      "userId",
      "id1",
      "https://refugies.info/dispositif/id1"
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      lastReminderMailSentToUpdateContentDate: 1573380000000,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
