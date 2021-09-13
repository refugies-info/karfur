// @ts-nocheck
import { sendReminderMailToUpdateContents } from "./sendReminderMailToUpdateContents";
import { getPublishedDispositifWithMainSponsor } from "../../../modules/dispositif/dispositif.repository";
import { checkCronAuthorization } from "../../../libs/checkAuthorizations";
//import { filterDispositifsForUpdateReminders } from "../../../modules/dispositif/dispositif.adapter";
//import { sendUpdateReminderMailService } from "../../../modules/mail/mail.service";
import moment from "moment";
import mockdate from "mockdate";
//import logger from "../../../logger";

mockdate.set("2019-11-10T10:00:00.00Z");

jest.mock("../../../logger");
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkCronAuthorization: jest.fn(),
}));

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getPublishedDispositifWithMainSponsor: jest.fn(),
}));

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDraftDispositifs: jest.fn(),
  updateDispositifInDB: jest.fn(),
}));

jest.mock("../../../modules/mail/mail.service", () => ({
  sendOneDraftReminderMailService: jest.fn(),
  sendMultipleDraftsReminderMailService: jest.fn(),
}));

jest.mock("../../../modules/dispositif/dispositif.adapter", () => ({
  filterDispositifsForUpdateReminders: jest.fn(),
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
        { roles: "administrateur", userId: "userId" },
        { roles: "contributeur", userId: "userId" },
      ],
    },
  };

  const dispo3 = {
    _id: "id3",
    titreInformatif: "titre",
    typeContenu: "dispositif",
    lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
    mainSponsor: {
      _id: "sponsor_id",
      membres: [
        { roles: "administrateur", userId: "userId" },
        { roles: "contributeur", userId: "userId" },
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
        { roles: "administrateur", userId: "userId" },
        { roles: "contributeur", userId: "userId" },
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
    const req = { body: { query: { cronToken: "cronToken" } } };
    await sendReminderMailToUpdateContents(req, res);
    expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
    expect(getPublishedDispositifWithMainSponsor).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
  });
  //
  //     expect(sendUpdateReminderMailService).toHaveBeenCalledWith(
  //       "email",
  //       "pseudo",
  //       "titre",
  //       "userId",
  //       "id1"
  //     );
  //     expect(sendUpdateReminderMailService).not.toHaveBeenCalledWith(
  //       "email",
  //       "pseudo",
  //       "titre",
  //       "userId",
  //       "id2"
  //     );
  //     expect(sendUpdateReminderMailService).not.toHaveBeenCalledWith(
  //       "email",
  //       "pseudo",
  //       "titre",
  //       "userId",
  //       "id3"
  //     );
  //     expect(logger.info).toHaveBeenCalledWith(
  //       "[sendUpdateReminderMailService] dispositif with id id2 has already received reminder 40 days ago"
  //     );
  //     expect(logger.info).toHaveBeenCalledWith(
  //       "[sendUpdateReminderMailService] dispositif with id id3 has been updated 3 days ago"
  //     );
  // expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
  //   draftReminderMailSentDate: 1573380000000,
  // });
  // expect(updateDispositifInDB).not.toHaveBeenCalledWith("id2", {
  //   draftReminderMailSentDate: 1573380000000,
  // });
  // expect(updateDispositifInDB).not.toHaveBeenCalledWith("id3", {
  //   draftReminderMailSentDate: 1573380000000,
  // });
});

//   it("should get dispositifs sendOneDraftReminderMailService for dispo id1 and continue with id2 4 even if it throws", async () => {
//     const dispo1 = {
//       _id: "id1",
//       titreInformatif: "titre",
//       lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
//       creatorId: { email: "email", username: "pseudo", _id: "userId" },
//     };
//     const dispo2 = {
//       _id: "id2",
//       titreInformatif: "titre",
//       lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
//       creatorId: { email: "email", username: "pseudo", _id: "userId" },
//       draftReminderMailSentDate: moment.utc("2019-02-01T13:00:00.232Z"),
//     };
//     getDraftDispositifs.mockResolvedValueOnce([
//       { ...dispo1, toJSON: () => dispo1 },
//       { ...dispo2, toJSON: () => dispo2 },
//     ]);
//     sendOneDraftReminderMailService.mockRejectedValueOnce(new Error("erreur"));
//     const req = { body: { query: { cronToken: "cronToken" } } };
//     await sendDraftReminderMail(req, res);
//     expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
//     expect(getDraftDispositifs).toHaveBeenCalledWith();
//     expect(sendOneDraftReminderMailService).toHaveBeenCalledWith(
//       "email",
//       "pseudo",
//       "titre",
//       "userId",
//       "id1"
//     );

//     expect(logger.info).toHaveBeenCalledWith(
//       "[sendDraftReminderMail] dispositif with id id2 has already received reminder"
//     );

//     expect(updateDispositifInDB).not.toHaveBeenCalledWith("id1", {
//       draftReminderMailSentDate: 1573380000000,
//     });

//     expect(res.status).toHaveBeenCalledWith(200);
//   });

//   it("should get dispositifs sendOneDraftReminderMailService for dispo with object in titre info", async () => {
//     const dispo1 = {
//       _id: "id1",
//       titreInformatif: { fr: "titre" },
//       lastModificationDate: moment.utc("2019-02-01T13:00:00.232Z"),
//       creatorId: { email: "email", username: "pseudo", _id: "userId" },
//     };
//     filterDispositifsForUpdateReminders.mockResolvedValueOnce([
//       { ...dispo1, toJSON: () => dispo1 },
//     ]);
//     const req = { body: { query: { cronToken: "cronToken" } } };
//     await sendReminderMailToUpdateContents(req, res);
//     expect(checkCronAuthorization).toHaveBeenCalledWith("cronToken");
//     expect(sendUpdateReminderMailService).toHaveBeenCalledWith(
//       "email",
//       "pseudo",
//       "titre",
//       "userId",
//       "id1"
//     );

//     // expect(updateDispositifInDB).toHaveBeenCalledWith("id1", {
//     //   draftReminderMailSentDate: 1573380000000,
//     // });

//     expect(res.status).toHaveBeenCalledWith(200);
//   });
// });
