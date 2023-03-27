// @ts-nocheck
import { sendDraftReminderMail } from "./sendDraftReminderMail";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";
import { getDraftDispositifs, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import {
  sendOneDraftReminderMailService,
  sendMultipleDraftsReminderMailService
} from "../../../modules/mail/mail.service";
import moment from "moment";
import mockdate from "mockdate";
import logger from "../../../logger";
import { log } from "./log";

mockdate.set("2019-11-10T10:00:00.00Z");

jest.mock("logger");
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkCronAuthorization: jest.fn()
}));

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDraftDispositifs: jest.fn(),
  updateDispositifInDB: jest.fn()
}));

jest.mock("../../../modules/mail/mail.service", () => ({
  sendOneDraftReminderMailService: jest.fn(),
  sendMultipleDraftsReminderMailService: jest.fn()
}));
jest.mock("./log", () => ({
  log: jest.fn().mockResolvedValue(undefined)
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockDispo = (dispo: object) => ({
  ...dispo,
  toJSON: () => dispo,
  get: (prop: string) => dispo[prop]
});

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
    mainSponsor: "ObjectID_Sponsor",
    lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" }
  };

  const dispo2 = {
    _id: "id2",
    titreInformatif: "titre",
    mainSponsor: "ObjectID_Sponsor",
    lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" },
    draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z")
  };
  const dispo3 = {
    _id: "id3",
    titreInformatif: "titre",
    mainSponsor: "ObjectID_Sponsor",
    lastModificationDate: moment.utc("2019-11-09T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" }
  };

  const dispo4 = {
    _id: "id4",
    titreInformatif: "titre",
    mainSponsor: "ObjectID_Sponsor",
    lastModificationDate: moment.utc("2019-10-09T13:00:00.232Z"),
    creatorId: { username: "pseudo", _id: "userId" }
  };

  const dispo5 = {
    _id: "id5",
    titreInformatif: "titre",
    mainSponsor: "ObjectID_Sponsor",
    lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" },
    draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z")
  };

  const dispo6 = {
    _id: "id6",
    titreInformatif: "titre",
    mainSponsor: "ObjectID_Sponsor",
    lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" },
    draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z"),
    draftSecondReminderMailSentDate: moment.utc("2019-02-25T13:00:00.232Z")
  };
  const dispo7 = {
    _id: "id7",
    titreInformatif: "titre",
    mainSponsor: "ObjectID_Sponsor",
    lastModificationDate: moment.utc("2019-10-15T13:00:00.232Z"),
    creatorId: { email: "email", username: "pseudo", _id: "userId" },
    draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z")
  };

  it("should send first reminder", async () => {
    getDraftDispositifs.mockResolvedValueOnce([
      mockDispo(dispo1),
      mockDispo(dispo2),
      mockDispo(dispo3),
      mockDispo(dispo4)
    ]);
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();

    // FIRST
    expect(sendOneDraftReminderMailService).toHaveBeenCalledWith(
      // id1: YES
      "email",
      "pseudo",
      "titre",
      "userId",
      "id1",
      "first"
    );
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalledWith(
      // id2: NO (received)
      "email",
      "pseudo",
      "titre",
      "userId",
      "id2",
      "first"
    );
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalledWith(
      // id3: NO (not 8 days)
      "email",
      "pseudo",
      "titre",
      "userId",
      "id3",
      "first"
    );
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalledWith(
      // id4: NO (no email)
      "email",
      "pseudo",
      "titre",
      "userId",
      "id4",
      "first"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id2 has already received reminder"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id3 has been updated 1 days ago"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id4, creator has no email related"
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id2", {
      draftReminderMailSentDate: 1573380000000
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id3", {
      draftReminderMailSentDate: 1573380000000
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id4", {
      draftReminderMailSentDate: 1573380000000
    });
    // expect(sendMultipleDraftsReminderMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should send second reminder", async () => {
    getDraftDispositifs.mockResolvedValueOnce([mockDispo(dispo5), mockDispo(dispo6), mockDispo(dispo7)]);
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();

    // SECOND
    expect(sendOneDraftReminderMailService).toHaveBeenCalledWith(
      // id1: YES
      "email",
      "pseudo",
      "titre",
      "userId",
      "id5",
      "second"
    );
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalledWith(
      // id2: NO (received)
      "email",
      "pseudo",
      "titre",
      "userId",
      "id6",
      "second"
    );
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalledWith(
      // id2: NO (not 30 days)
      "email",
      "pseudo",
      "titre",
      "userId",
      "id7",
      "second"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id6 has already received reminder"
    );
    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id7 has been updated 26 days ago"
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id5", {
      draftSecondReminderMailSentDate: 1573380000000
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id6", {
      draftSecondReminderMailSentDate: 1573380000000
    });
    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id7", {
      draftSecondReminderMailSentDate: 1573380000000
    });
    expect(sendMultipleDraftsReminderMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get dispositifs sendOneDraftReminderMailService for dispo id1 and continue with id2 4 even if it throws", async () => {
    const dispo1 = {
      _id: "id1",
      titreInformatif: "titre",
      mainSponsor: "ObjectID_Sponsor",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" }
    };
    const dispo2 = {
      _id: "id2",
      titreInformatif: "titre",
      mainSponsor: "ObjectID_Sponsor",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" },
      draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z")
    };
    getDraftDispositifs.mockResolvedValueOnce([mockDispo(dispo1), mockDispo(dispo2)]);
    sendOneDraftReminderMailService.mockRejectedValueOnce(new Error("erreur"));
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendOneDraftReminderMailService).toHaveBeenCalledWith("email", "pseudo", "titre", "userId", "id1", "first");

    expect(logger.info).toHaveBeenCalledWith(
      "[sendDraftReminderMail] dispositif with id id2 has already received reminder"
    );

    expect(updateDispositifInDB).not.toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get dispositifs sendMultipleDraftsReminderMailService for dispos with same creator", async () => {
    const dispo1 = {
      _id: "id1",
      titreInformatif: "titre",
      mainSponsor: "ObjectID_Sponsor",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" }
    };
    const dispo2 = {
      _id: "id2",
      titreInformatif: "titre",
      mainSponsor: "ObjectID_Sponsor",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" }
    };
    getDraftDispositifs.mockResolvedValueOnce([mockDispo(dispo1), mockDispo(dispo2)]);
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendOneDraftReminderMailService).not.toHaveBeenCalled();
    expect(sendMultipleDraftsReminderMailService).toHaveBeenCalledWith("email", "pseudo", "userId", "first");

    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000
    });
    expect(updateDispositifInDB).toHaveBeenCalledWith("id2", {
      draftReminderMailSentDate: 1573380000000
    });
    expect(log).toHaveBeenCalledWith("id1", "first");
    expect(log).toHaveBeenCalledWith("id2", "first");

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get dispositifs sendOneDraftReminderMailService for dispo with object in titre info", async () => {
    const dispo1 = {
      _id: "id1",
      titreInformatif: { fr: "titre" },
      mainSponsor: "ObjectID_Sponsor",
      lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
      creatorId: { email: "email", username: "pseudo", _id: "userId" }
    };
    getDraftDispositifs.mockResolvedValueOnce([mockDispo(dispo1)]);
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendDraftReminderMail(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getDraftDispositifs).toHaveBeenCalledWith();
    expect(sendOneDraftReminderMailService).toHaveBeenCalledWith("email", "pseudo", "titre", "userId", "id1", "first");
    expect(sendMultipleDraftsReminderMailService).not.toHaveBeenCalled();

    expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
      draftReminderMailSentDate: 1573380000000
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
