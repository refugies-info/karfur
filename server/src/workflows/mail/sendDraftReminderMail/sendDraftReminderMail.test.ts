// @ts-nocheck
import { sendDraftReminderMail } from "./sendDraftReminderMail";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";
import {
  getDraftDispositifs,
  updateDispositifInDB,
} from "../../../modules/dispositif/dispositif.repository";
import {
  sendOneDraftReminderMailService,
  sendMultipleDraftsReminderMailService,
} from "../../../modules/mail/mail.service";
import moment from "moment";
import mockdate from "mockdate";
import logger from "../../../logger";

mockdate.set("2019-11-10T10:00:00.00Z");

jest.mock("../../../logger");
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkCronAuthorization: jest.fn(),
}));

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDraftDispositifs: jest.fn(),
  updateDispositifInDB: jest.fn(),
}));

jest.mock("../../../modules/mail/mail.service", () => ({
  sendOneDraftReminderMailService: jest.fn(),
  sendMultipleDraftsReminderMailService: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("sendDraftReminderMail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 404 if not authorized", async () => {
    checkCronAuthorization.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(res.status).toHaveBeenCalledWith(404);
  });
  const dispo1 = {
    _id: "id1",
    titreInformatif: "titre",
    lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" },
  };

  const dispo2 = {
    _id: "id2",
    titreInformatif: "titre",
    lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" },
    draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z"),
  };
  const dispo3 = {
    _id: "id3",
    titreInformatif: "titre",
    lastModificationDate: moment.utc("2019-11-09T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" },
  };

  const dispo4 = {
    _id: "id4",
    titreInformatif: "titre",
    lastModificationDate: moment.utc("2019-10-09T13:00:00.232Z"),
    creatorId: { username: "pseudo", _id: "userId" },
  };
  it("should get dispositifs sendOneDraftReminderMailService for dispo id1, not id2 (received), not id3(nb days too small), not id4 (no email)", async () => {
    getDraftDispositifs.mockResolvedValueOnce([
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
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendOneDraftReminderMailService).toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id1"
    );
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id2"
    );
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id3"
    );
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id4"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id2 has already received reminder"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id3 has been updated 1 ago"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id4, creator has no email related"
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id2", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id3", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id4", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(sendMultipleDraftsReminderMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get dispositifs sendOneDraftReminderMailService for dispo id1 and continue with id2 4 even if it throws", async () => {
    const dispo1 = {
      _id: "id1",
      titreInformatif: "titre",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" },
    };
    const dispo2 = {
      _id: "id2",
      titreInformatif: "titre",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" },
      draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z"),
    };
    getDraftDispositifs.mockResolvedValueOnce([
      { ...dispo1, toJSON: () => dispo1 },
      { ...dispo2, toJSON: () => dispo2 },
    ]);
    sendOneDraftReminderMailService.mockRejectedValueOnce(new Error("erreur"));
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendOneDraftReminderMailService).toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id1"
    );

    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id2 has already received reminder"
    );

    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000,
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get dispositifs sendMultipleDraftsReminderMailService for dispos with same creator", async () => {
    const dispo1 = {
      _id: "id1",
      titreInformatif: "titre",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" },
    };
    const dispo2 = {
      _id: "id2",
      titreInformatif: "titre",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" },
    };
    getDraftDispositifs.mockResolvedValueOnce([
      { ...dispo1, toJSON: () => dispo1 },
      { ...dispo2, toJSON: () => dispo2 },
    ]);
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalled();
    expect(sendMultipleDraftsReminderMailService).toHaveBeenCalledWith(
      "email",
      "pseudo",
      "userId"
    );

    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000,
    });
    expect(updateDispositifInDB).toHaveBeenCalledWith("id2", {
      draftReminderMailSentDate: 1573380000000,
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get dispositifs sendOneDraftReminderMailService for dispo with object in titre info", async () => {
    const dispo1 = {
      _id: "id1",
      titreInformatif: { fr: "titre" },
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" },
    };
    getDraftDispositifs.mockResolvedValueOnce([
      { ...dispo1, toJSON: () => dispo1 },
    ]);
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendOneDraftReminderMailService).toHaveBeenCalledWith(
      "email",
      "pseudo",
      "titre",
      "userId",
      "id1"
    );
    expect(sendMultipleDraftsReminderMailService).not.toHaveBeenCalled();

    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000,
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
